<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need to authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CmdGenie - Agent Instructions

This file contains guidelines for AI agents working on the CmdGenie codebase.

## Development Commands

### Installation
```bash
npm install
```

### Build
```bash
# Compile TypeScript to JavaScript
npm run build

# Watch mode for development
npm run dev

# Clean build output
npm run clean
```

### Manual Testing
```bash
# Build first, then run CLI
npm run build
node dist/index.js "find all directories"

# Or after global installation
npm link
cmdgenie "show disk usage"
```

### Update LLM Provider
```bash
node dist/index.js --update-llm openai sk-your-key
node dist/index.js --update-llm anthropic your-key claude-3-haiku-20240307
node dist/index.js --update-llm google your-key gemini-pro
node dist/index.js --update-llm cohere your-key
```

## Architecture Overview

CmdGenie is a single-file CLI tool using Node.js and TypeScript with the following structure:

- **Entry Point**: `index.ts` (TypeScript source)
- **Compiled Output**: `dist/index.js` (compiled JavaScript with shebang)
- **Class**: `CmdGenie` class encapsulates all functionality
- **Config**: Stored in `~/.cmdgenie/config.json`
- **LLM Providers**: OpenAI, Anthropic, Google, Cohere
- **Cross-Platform**: Uses `os.platform()` to detect OS

## Code Style Guidelines

### Import Patterns
Use ES6 import statements (TypeScript):
```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as readline from 'readline';
```

Promisify async utilities:
```typescript
const execAsync = promisify(exec);
```

### Class Structure
Define class with constructor for config initialization:
```typescript
class CmdGenie {
    public config: Config;

    constructor() {
        this.config = this.loadConfig();
    }

    // Methods follow...
}
```

### Naming Conventions
- **Class names**: PascalCase (`CmdGenie`)
- **Method names**: camelCase (`loadConfig`, `generateCommand`, `callOpenAI`)
- **Constants**: UPPER_SNAKE_CASE (`CONFIG_DIR`, `CONFIG_FILE`)
- **Variables**: camelCase (`provider`, `apiKey`, `model`)
- **Interfaces**: PascalCase with descriptive names (`Config`, `ProviderConfig`)

### TypeScript Patterns
Define interfaces for type safety:
```typescript
interface Config {
    provider: string;
    apiKey: string | null;
    model: string;
}

interface ProviderConfig {
    defaultModel: string;
}
```

Use type annotations for all function parameters and return types:
```typescript
async loadConfig(): Config {
    // ...
}

async updateLLM(provider: string, apiKey: string, model: string | null = null): Promise<void> {
    // ...
}
```

Use type assertions for external API responses:
```typescript
const data = await response.json() as OpenAIResponse;
```

### Error Handling
Wrap operations in try-catch blocks with console.error:
```javascript
try {
    // Operation
} catch (error) {
    console.error('Error description:', error.message);
}
```

Validate input before processing:
```javascript
if (!providers[provider]) {
    console.error(`Unsupported provider: ${provider}`);
    console.log('Supported providers:', Object.keys(providers).join(', '));
    return;
}
```

### Async/Await Patterns
Always use async/await for async operations:
```javascript
async function main() {
    const genie = new CmdGenie();
    // ...
}

main().catch(console.error);
```

Mark async methods:
```javascript
async updateLLM(provider, apiKey, model = null) {
    // ...
}
```

### String Formatting
Use template literals for interpolation:
```javascript
console.log(`✅ LLM updated: ${provider} with model ${this.config.model}`);
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
```

### Console Output
Use emojis for visual distinction:
- ✅ Success operations
- ❌ Errors
- 🤖 AI processing
- 💡 Information/results
- 🚀 Execution actions

### Config Management
Load config with fallback to defaults:
```javascript
loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading config:', error.message);
    }
    return { /* defaults */ };
}
```

Save config with directory creation:
```javascript
saveConfig() {
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
    } catch (error) {
        console.error('Error saving config:', error.message);
    }
}
```

### LLM Provider Methods
Each provider has dedicated method following pattern:
```javascript
async call[Provider](prompt) {
    const response = await fetch('api-endpoint', {
        method: 'POST',
        headers: { /* headers */ },
        body: JSON.stringify({ /* payload */ })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || '[Provider] API error');
    }

    return data.command_path.trim();
}
```

### System Prompts
Include OS detection and strict output formatting:
```javascript
{
    role: 'system',
    content: `You are a command line expert. Generate only the exact command(s) needed for the user's request.
Respond with ONLY the command(s), no explanations or formatting.
If multiple commands are needed, separate them with &&.
Detect the operating system context and provide appropriate commands.
Current OS: ${os.platform()}`
}
```

### Command Cleaning
Clean AI responses before execution:
```javascript
command = command.replace(/```[\s\S]*?```/g, '').replace(/`/g, '').trim();
```

### Interactive Execution
Use readline for user confirmation:
```javascript
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('\n🚀 Execute this command? (y/N): ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        // Execute
    }
    rl.close();
});
```

### Main Execution Pattern
Parse arguments and route to methods:
```javascript
async function main() {
    const genie = new CmdGenie();
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        genie.showHelp();
        return;
    }

    if (args[0] === '--update-llm') {
        await genie.updateLLM(args[1], args[2], args[3]);
        return;
    }

    const prompt = args.join(' ').replace(/^["']|["']$/g, '');
    await genie.generateCommand(prompt);
}

main().catch(console.error);
```

## Security Guidelines

- **Never log API keys** in console output
- **Validate provider names** against allowed list
- **Store config in user home directory** (`~/.cmdgenie/`)
- **Show commands before execution** for user review
- **Use relative paths** in prompts, avoid exposing system paths

## File Organization

- **Keep single-file architecture** (`index.ts` only)
- **Compiled output** in `dist/` directory
- **Constants at top** (CONFIG_DIR, CONFIG_FILE)
- **Interface definitions** before class
- **Class definition** after constants
- **Main execution** at bottom
- **No tests or linting** - manual testing only

## Adding New LLM Providers

1. Add provider to `providers` object in `updateLLM()`
2. Create `call[ProviderName]()` method with type annotations
3. Define interfaces for new provider's API response
4. Add case in `generateCommand()` switch statement
5. Update help text in `showHelp()`
6. Test with manual CLI commands

## Important Notes

- **Node.js version**: >=14.0.0
- **TypeScript enabled** - compile with `npm run build`
- **No test framework** - manual testing via CLI
- **No linting** - follow existing code style and TypeScript best practices
- **Cross-platform** - always use `os.platform()` in prompts
- **Shebang required**: `#!/usr/bin/env node` at top of compiled `dist/index.js`
- **Single file** - maintain all code in index.ts
