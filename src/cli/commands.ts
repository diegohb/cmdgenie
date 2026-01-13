import { Command } from 'commander';
import * as readline from 'readline';
import { CmdGenie } from './index';

function promptUser(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

export function setupCLI(): Command {
    const program = new Command();

    program
        .name('cmdgenie')
        .description('AI-Powered Command Generator')
        .version('1.0.0')
        .option('-h, --help', 'display help for command');

    // Main command for prompt generation
    program
        .argument('[prompt...]', 'Natural language description of the command you want')
        .action(async (prompt: string[]) => {
            const promptText = prompt.join(' ');
            if (!promptText) {
                program.help();
                return;
            }

            const genie = new CmdGenie();
            await genie.GenerateCommand(promptText);
        });

    // Provider management commands
    program
        .command('add-provider')
        .description('Add a new LLM provider')
        .argument('[name]', 'Provider name')
        .argument('[provider]', 'Provider type (openai, anthropic, google, cohere, ollama, custom)')
        .argument('[api-key]', 'API key for the provider')
        .argument('[model]', 'Model name (optional, uses default if not specified)')
        .argument('[endpoint-url]', 'Custom endpoint URL (required for custom provider)')
        .action(async (name?: string, provider?: string, apiKey?: string, model?: string, endpointUrl?: string) => {
            if (!name) {
                name = await promptUser('Provider name: ');
            }
            if (!provider) {
                provider = await promptUser('Provider type (openai, anthropic, google, cohere, ollama, custom): ');
            }
            if (!apiKey) {
                apiKey = await promptUser('API key: ');
            }
            // model and endpointUrl are optional

            const genie = new CmdGenie();
            genie.AddProvider(name, provider, apiKey, model, endpointUrl);
        });

    program
        .command('list-providers')
        .description('List all configured providers')
        .action(() => {
            const genie = new CmdGenie();
            genie.ListProviders();
        });

    program
        .command('remove-provider')
        .description('Remove a provider')
        .argument('[name]', 'Provider name to remove')
        .action(async (name?: string) => {
            if (!name) {
                name = await promptUser('Provider name to remove: ');
            }
            const genie = new CmdGenie();
            genie.RemoveProvider(name);
        });

    program
        .command('show-provider')
        .description('Show details of a specific provider')
        .argument('[name]', 'Provider name')
        .action(async (name?: string) => {
            if (!name) {
                name = await promptUser('Provider name: ');
            }
            const genie = new CmdGenie();
            genie.ShowProvider(name);
        });

    program
        .command('update-llm')
        .description('Set the active LLM provider')
        .argument('[provider-name]', 'Name of the provider to activate')
        .action(async (providerName?: string) => {
            if (!providerName) {
                providerName = await promptUser('Provider name to activate: ');
            }
            const genie = new CmdGenie();
            await genie.UpdateActiveProvider(providerName);
        });

    return program;
}