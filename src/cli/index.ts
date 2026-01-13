import * as readline from 'readline';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigManager } from '../config';
import { ProviderRegistry } from '../providers/registry';
import { PROVIDERS, Config } from '../types';

const execAsync = promisify(exec);

export class CmdGenie {
    private readonly _configManager: ConfigManager;
    private readonly _providerRegistry: ProviderRegistry;

    constructor() {
        this._configManager = new ConfigManager();
        this._providerRegistry = new ProviderRegistry();
    }

    public get Config(): Config {
        return this._configManager.Config;
    }

    public async UpdateLLM(provider: string, apiKey: string, model: string | null = null): Promise<void> {
        const success = this._configManager.UpdateLLM(provider, apiKey, model);
        if (!success) {
            console.error(`Unsupported provider: ${provider}`);
            console.log('Supported providers:', Object.keys(PROVIDERS).join(', '));
        }
    }

    public async GenerateCommand(prompt: string): Promise<void> {
        if (!this._configManager.HasApiKey()) {
            console.error('❌ No API key configured. Please run: cmdgenie --update-llm <provider> <api-key>');
            return;
        }

        console.log('🤖 Generating command...');

        try {
            const provider = this._providerRegistry.GetProvider(this._configManager.Provider);
            
            if (!provider) {
                throw new Error(`Unsupported provider: ${this._configManager.Provider}`);
            }

            let command = await provider.Execute(
                prompt,
                this._configManager.ApiKey!,
                this._configManager.Model
            );

            command = command.replace(/```[\s\S]*?```/g, '').replace(/`/g, '').trim();

            console.log(`\n💡 Generated command: ${command}`);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('\n🚀 Execute this command? (y/N): ', async (answer: string) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    try {
                        console.log('\n📋 Executing...');
                        const { stdout, stderr } = await execAsync(command);
                        if (stdout) console.log(stdout);
                        if (stderr) console.error(stderr);
                    } catch (error) {
                        console.error('❌ Execution error:', (error as Error).message);
                    }
                }
                rl.close();
            });

        } catch (error) {
            console.error('❌ Error generating command:', (error as Error).message);
        }
    }

    public ShowHelp(): void {
        console.log(`
 🧞 CmdGenie - AI-Powered Command Generator

 Usage:
   cmdgenie "your natural language request"
   cmdgenie --update-llm <provider> <api-key> [model]
   cmdgenie --help

 Examples:
   cmdgenie "find all directories in current folder"
   cmdgenie "show disk usage"
   cmdgenie "kill process on port 3000"
   
 Update LLM:
   cmdgenie --update-llm openai sk-your-api-key
   cmdgenie --update-llm anthropic your-api-key claude-3-haiku-20240307
   cmdgenie --update-llm google your-api-key gemini-pro
   cmdgenie --update-llm cohere your-api-key

 Current config:
   Provider: ${this._configManager.Provider}
   Model: ${this._configManager.Model}
   API Key: ${this._configManager.ApiKey ? '✅ Set' : '❌ Not set'}
`);
    }
}
