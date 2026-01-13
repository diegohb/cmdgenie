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

### Provider Management
```bash
# Add a provider
cmdgenie add-provider openai openai sk-your-api-key

# List configured providers
cmdgenie list-providers

# Set active provider
cmdgenie update-llm openai

# Remove a provider
cmdgenie remove-provider openai
```

### Provider Management Commands
```bash
# Add providers
node dist/index.js add-provider openai openai sk-your-key
node dist/index.js add-provider anthropic anthropic your-key claude-3-haiku-20240307
node dist/index.js add-provider google google your-key gemini-pro
node dist/index.js add-provider cohere cohere your-key command

# Set active provider
node dist/index.js update-llm openai

# List providers
node dist/index.js list-providers
```

## Architecture Overview

CmdGenie is a modular CLI tool using Node.js and TypeScript with the following structure:

- **Source Directory**: `src/` (TypeScript source modules)
- **Compiled Output**: `dist/index.js` (compiled JavaScript with shebang)
- **Modules**:
  - `src/types/` - Type definitions (Config, ProviderConfig, provider responses)
  - `src/config/` - Configuration management (ConfigManager, ProviderRegistryManager)
  - `src/providers/` - LLM provider implementations (OpenAI, Anthropic, Google, Cohere, Ollama, Custom)
  - `src/cli/` - CLI interface (CmdGenie class, Commander.js commands)
  - `src/main.ts` - Main entry point with Commander.js setup
- **Entry Point**: `src/main.ts` (Commander.js CLI setup)
- **Class**: `CmdGenie` class encapsulates CLI functionality
- **Config**: Active provider in `~/.cmdgenie/config.json`, providers in `~/.cmdgenie/providers.json`
- **LLM Providers**: OpenAI, Anthropic, Google, Cohere, Ollama, Custom (modular implementations)
- **CLI Framework**: Commander.js for structured command parsing with interactive prompting
- **Cross-Platform**: Uses `os.platform()` and shell detection for context

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
Define class with constructor and explicit access modifiers:
```typescript
export class CmdGenie {
    private readonly _configManager: ConfigManager;

    constructor() {
        this._configManager = new ConfigManager();
    }

    public get Config(): Config {
        return this._configManager.Config;
    }

    public async GenerateCommand(prompt: string): Promise<void> {
        // Check active provider, get provider instance, execute with OS/shell context
    }

    public AddProvider(name: string, provider: string, apiKey: string, model?: string, endpointUrl?: string): void {
        this._configManager.RegistryManager.AddProvider(name, provider, apiKey, model || '', endpointUrl);
    }

    public async UpdateActiveProvider(providerName: string): Promise<void> {
        const success = this._configManager.UpdateActiveProvider(providerName);
        if (!success) {
            console.error(`Failed to update active provider to: ${providerName}`);
        }
    }
}
```

### Naming Conventions
- **Class names**: PascalCase (`CmdGenie`, `ConfigManager`, `OpenAIProvider`)
- **Public method names**: PascalCase (`GenerateCommand`, `LoadConfig`, `SaveConfig`)
- **Private/internal method names**: underscore+pascalCase (`_LoadConfig`, `_callOpenAI`, `_validateConfig`)
- **Public property names**: PascalCase (`Config`, `Provider`, `Model`)
- **Private/internal property names**: underscore+pascalCase (`_config`, `_providerRegistry`, `_apiKey`)
- **Constants**: UPPER_SNAKE_CASE (`CONFIG_DIR`, `CONFIG_FILE`, `MAX_TOKENS`)
- **Variables**: camelCase (`provider`, `apiKey`, `model`)
- **Interfaces**: PascalCase with descriptive names (`Config`, `ProviderConfig`, `Provider`)

### TypeScript Patterns
Define interfaces for type safety:
```typescript
export interface Config {
    activeProvider: string;
}

export interface ProviderEntry {
    name: string;
    provider: string;
    apiKey: string;
    model: string;
    endpointUrl?: string;
}

export interface ProviderRegistry {
    [providerName: string]: ProviderEntry;
}

export interface ProviderConfig {
    defaultModel: string;
}

export interface Provider {
    Name: string;
    Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string>;
}
```

Use type annotations for all function parameters and return types:
```typescript
public async GenerateCommand(prompt: string): Promise<void> {
    // ...
}

public AddProvider(name: string, provider: string, apiKey: string, model?: string, endpointUrl?: string): void {
    // ...
}

public async UpdateActiveProvider(providerName: string): Promise<void> {
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
```typescript
async function main() {
    const genie = new CmdGenie();
    // ...
}

main().catch(console.error);
```

Mark async methods with public access modifier:
```typescript
public async UpdateLLM(provider: string, apiKey: string, model: string | null = null): Promise<void> {
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
Load active provider config with fallback:
```typescript
private _LoadConfig(): Config {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading config:', (error as Error).message);
    }
    return { activeProvider: '' };
}
```

Registry-based provider management:
```typescript
private _LoadRegistry(): ProviderRegistry {
    try {
        if (fs.existsSync(PROVIDERS_FILE)) {
            return JSON.parse(fs.readFileSync(PROVIDERS_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading provider registry:', (error as Error).message);
    }
    return {};
}

public AddProvider(name: string, provider: string, apiKey: string, model: string, endpointUrl?: string): boolean {
    // Validate and add to registry
    this._registry[name] = { name, provider, apiKey, model, endpointUrl };
    this.SaveRegistry();
    return true;
}
```

### LLM Provider Structure
Each provider is a separate class implementing the Provider interface:
```typescript
// src/types/index.ts
export interface Provider {
    Name: string;
    Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string>;
}

// src/providers/openai.ts
export class OpenAIProvider implements Provider {
    public readonly Name: string = 'openai';

    public async Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string> {
        const url = endpointUrl || OPENAI_URL;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `You are a command line expert. Generate only the exact command(s) needed...
Current OS: ${GetOS()}, Current Shell: ${GetShell()}`
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: MAX_TOKENS,
                temperature: TEMPERATURE
            })
        });

        const data = await response.json() as OpenAIResponse;
        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API error');
        }

        return data.choices[0].message.content.trim();
    }
}
```

### System Prompts
Include OS and shell detection for contextual command generation:
```javascript
{
    role: 'system',
    content: `You are a command line expert. Generate only the exact command(s) needed for the user's request.
Respond with ONLY the command(s), no explanations or formatting.
If multiple commands are needed, separate them with &&.
Detect the operating system and shell context and provide appropriate commands.
Current OS: ${GetOS()}, Current Shell: ${GetShell()}`
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
Use Commander.js for structured CLI with interactive prompting:
```typescript
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
```

### Command Structure
Define commands with Commander.js:
```typescript
program
    .command('add-provider')
    .description('Add a new LLM provider')
    .argument('[name]', 'Provider name')
    .argument('[provider]', 'Provider type')
    .argument('[api-key]', 'API key')
    .action(async (name?: string, provider?: string, apiKey?: string) => {
        // Interactive prompting for missing args
        if (!name) name = await promptUser('Provider name: ');
        // ... implementation
    });
```

## Security Guidelines

- **Never log API keys** in console output
- **Validate provider names** against allowed list
- **Store config in user home directory** (`~/.cmdgenie/config.json` and `~/.cmdgenie/providers.json`)
- **Show commands before execution** for user review
- **Use relative paths** in prompts, avoid exposing system paths

## File Organization

- **Source directory**: `src/` with modular structure
- **Compiled output** in `dist/` directory
- **Module structure**:
  - `src/types/` - Type definitions and interfaces
  - `src/config/` - Configuration management (ConfigManager, ProviderRegistryManager)
  - `src/providers/` - LLM provider implementations (OpenAI, Anthropic, Google, Cohere, Ollama, Custom)
  - `src/cli/` - CLI interface (CmdGenie class, Commander.js commands)
  - `src/main.ts` - Main entry point with CLI setup
- **Public API** exported from `src/cli/index.ts` and `src/types/index.ts`
- **CLI Framework**: Commander.js with interactive prompting
- **Configuration**: Registry-based provider storage with active provider selection
- **Testing**: Jest framework with comprehensive unit and integration tests
- **Linting**: Oxlint for code quality and style checking

## Custom LLM Providers

CmdGenie supports custom OpenAI-compatible LLM providers for maximum flexibility:

### Adding Custom Providers
```bash
# Basic custom provider
node dist/index.js add-provider mycustom custom your-api-key gpt-3.5-turbo https://api.example.com/v1/chat/completions

# Custom provider with different model
node dist/index.js add-provider mylocal custom your-api-key llama-3.1-8b http://localhost:8000/v1/chat/completions
```

### Supported API Formats
- **OpenAI-compatible** REST API endpoints
- JSON request/response format matching OpenAI Chat Completions API
- Bearer token authentication
- Standard chat completion parameters (messages, model, max_tokens, temperature)

### Requirements
- Endpoint URL must be provided when registering custom providers
- API must support OpenAI Chat Completions format
- Valid API key for authentication

### Troubleshooting
- **Connection errors**: Verify endpoint URL is accessible and correct
- **Authentication errors**: Check API key is valid and properly formatted
- **Format errors**: Ensure API supports OpenAI-compatible chat completions endpoint
- **Model not found**: Verify the model name is supported by your custom provider

## Adding New LLM Providers

1. Create new provider file in `src/providers/` (e.g., `mistral.ts`)
2. Implement Provider interface with public `Name` property and `Execute` method
3. Add provider registration to `src/providers/registry.ts`
4. Add provider to `PROVIDERS` constant in `src/types/index.ts`
5. Add provider URL and model constants to `src/types/index.ts`
6. Test with manual CLI commands

## Important Notes

- **Node.js version**: >=14.0.0
- **TypeScript enabled** - compile with `npm run build`
- **Testing**: Jest framework with comprehensive unit and integration tests
- **Linting**: Oxlint for code quality and style checking
- **Cross-platform** - uses `GetOS()` and `GetShell()` for context
- **Shebang required**: `#!/usr/bin/env node` at top of compiled `dist/index.js`
- **Modular architecture** - use src/ directory for all source code


