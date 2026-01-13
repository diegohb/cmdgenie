import * as readline from 'readline';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigManager } from '../config';
import { ProviderRegistry } from '../providers/registry';
import { Config } from '../types';

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

    public async UpdateActiveProvider(providerName: string): Promise<void> {
        const success = this._configManager.UpdateActiveProvider(providerName);
        if (!success) {
            console.error(`Failed to update active provider to: ${providerName}`);
        }
    }

    public AddProvider(name: string, provider: string, apiKey: string, model?: string, endpointUrl?: string): void {
        const success = this._configManager.RegistryManager.AddProvider(name, provider, apiKey, model || '', endpointUrl);
        if (!success) {
            console.error(`Failed to add provider: ${name}`);
        }
    }

    public ListProviders(): void {
        const providers = this._configManager.RegistryManager.ListProviders();
        if (providers.length === 0) {
            console.log('No providers configured.');
            return;
        }
        console.log('Configured providers:');
        providers.forEach(name => {
            const entry = this._configManager.RegistryManager.GetProvider(name);
            if (entry) {
                console.log(`  ${name}: ${entry.provider} (${entry.model})`);
            }
        });
    }

    public RemoveProvider(name: string): void {
        const success = this._configManager.RegistryManager.RemoveProvider(name);
        if (!success) {
            console.error(`Failed to remove provider: ${name}`);
        }
    }

    public ShowProvider(name: string): void {
        const entry = this._configManager.RegistryManager.GetProvider(name);
        if (!entry) {
            console.error(`Provider '${name}' not found`);
            return;
        }
        console.log(`Provider: ${name}`);
        console.log(`  Type: ${entry.provider}`);
        console.log(`  Model: ${entry.model}`);
        console.log(`  API Key: ${entry.apiKey ? '✅ Set' : '❌ Not set'}`);
        if (entry.endpointUrl) {
            console.log(`  Endpoint: ${entry.endpointUrl}`);
        }
    }

    public async GenerateCommand(prompt: string): Promise<void> {
        if (!this._configManager.HasActiveProvider()) {
            if (this._configManager.RegistryManager.ListProviders().length === 0) {
                // First run: no providers configured
                console.error('❌ No providers configured. This appears to be your first run.');
                console.log('Please add a provider first:');
                console.log('  cmdgenie --add-provider <name> <provider> <api-key> [model] [endpoint-url]');
                console.log('Examples:');
                console.log('  cmdgenie --add-provider myopenai openai sk-your-api-key');
                console.log('  cmdgenie --add-provider mycustom custom your-api-key gpt-3.5-turbo https://api.example.com/v1/chat/completions');
                return;
            } else {
                console.error('❌ No active provider selected. Please choose one:');
                console.log('Available providers:', this._configManager.RegistryManager.ListProviders().join(', '));
                console.log('Set active: cmdgenie --update-llm <provider-name>');
                return;
            }
        }

        console.log('🤖 Generating command...');

        try {
            const activeEntry = this._configManager.GetActiveProviderEntry();
            if (!activeEntry) {
                throw new Error('Active provider not found in registry');
            }

            const provider = this._providerRegistry.GetProvider(activeEntry.provider);

            if (!provider) {
                throw new Error(`Unsupported provider: ${activeEntry.provider}`);
            }

            let command = await provider.Execute(
                prompt,
                activeEntry.apiKey,
                activeEntry.model,
                activeEntry.endpointUrl
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
        const activeEntry = this._configManager.GetActiveProviderEntry();
        console.log(`
  🧞 CmdGenie - AI-Powered Command Generator

  Usage:
    cmdgenie "your natural language request"
     cmdgenie --add-provider <name> <provider> <api-key> [model] [endpoint-url]
    cmdgenie --list-providers
    cmdgenie --remove-provider <name>
    cmdgenie --show-provider <name>
    cmdgenie --update-llm <provider-name>
    cmdgenie --help

  Examples:
    cmdgenie "find all directories in current folder"
    cmdgenie "show disk usage"
    cmdgenie "kill process on port 3000"

  Provider Management:
    cmdgenie --add-provider myopenai openai sk-your-api-key
    cmdgenie --add-provider myanthropic anthropic your-api-key claude-3-haiku-20240307
    cmdgenie --add-provider mycustom custom your-api-key gpt-3.5-turbo https://api.example.com/v1/chat/completions
    cmdgenie --list-providers
    cmdgenie --show-provider myopenai
    cmdgenie --update-llm myopenai
    cmdgenie --remove-provider myopenai

  Current config:
    Active Provider: ${this._configManager.ActiveProvider || 'None'}
    Provider Type: ${activeEntry?.provider || 'N/A'}
    Model: ${activeEntry?.model || 'N/A'}
    API Key: ${activeEntry?.apiKey ? '✅ Set' : '❌ Not set'}
 `);
    }
}
