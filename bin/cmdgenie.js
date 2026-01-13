#!/usr/bin/env node

const { CmdGenie } = require('../dist/cli');

async function main() {
    const genie = new CmdGenie();
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        genie.ShowHelp();
        return;
    }

    if (args[0] === '--add-provider') {
        if (args.length < 4) {
            console.error('❌ Usage: cmdgenie --add-provider <name> <provider> <api-key> [model] [endpoint-url]');
            return;
        }
        genie.AddProvider(args[1], args[2], args[3], args[4], args[5]);
        return;
    }

    if (args[0] === '--list-providers') {
        genie.ListProviders();
        return;
    }

    if (args[0] === '--remove-provider') {
        if (args.length < 2) {
            console.error('❌ Usage: cmdgenie --remove-provider <name>');
            return;
        }
        genie.RemoveProvider(args[1]);
        return;
    }

    if (args[0] === '--show-provider') {
        if (args.length < 2) {
            console.error('❌ Usage: cmdgenie --show-provider <name>');
            return;
        }
        genie.ShowProvider(args[1]);
        return;
    }

    if (args[0] === '--update-llm') {
        if (args.length < 2) {
            console.error('❌ Usage: cmdgenie --update-llm <provider-name>');
            return;
        }
        await genie.UpdateActiveProvider(args[1]);
        return;
    }

    const prompt = args.join(' ').replace(/^["']|["']$/g, '');
    await genie.GenerateCommand(prompt);
}

main().catch(console.error);
