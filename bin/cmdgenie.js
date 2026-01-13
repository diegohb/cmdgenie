#!/usr/bin/env node

const { CmdGenie } = require('../dist/cli');

async function main() {
    const genie = new CmdGenie();
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        genie.ShowHelp();
        return;
    }

    if (args[0] === '--update-llm') {
        if (args.length < 3) {
            console.error('❌ Usage: cmdgenie --update-llm <provider> <api-key> [model]');
            return;
        }
        await genie.UpdateLLM(args[1], args[2], args[3]);
        return;
    }

    const prompt = args.join(' ').replace(/^["']|["']$/g, '');
    await genie.GenerateCommand(prompt);
}

main().catch(console.error);
