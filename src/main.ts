import { setupCLI } from './cli/commands';

async function main() {
    const program = setupCLI();

    try {
        await program.parseAsync();
    } catch (error) {
        console.error('❌ Error:', (error as Error).message);
        process.exit(1);
    }
}

main().catch(console.error);