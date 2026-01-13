<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

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
node dist/main.js update-llm openai
node dist/main.js update-llm anthropic
node dist/main.js update-llm google
node dist/main.js update-llm cohere
```

## Architecture Overview

CmdGenie is a modular CLI tool using Node.js and TypeScript with the following structure:

- **Source Directory**: `src/` (TypeScript source modules)
- **Compiled Output**: `dist/index.js` (compiled JavaScript with shebang)
- **Modules**:
  - `src/types/` - Type definitions (Config, ProviderConfig, provider responses)
  - `src/config/` - Configuration management (ConfigManager class)
  - `src/providers/` - LLM provider implementations (OpenAI, Anthropic, Google, Cohere)
  - `src/cli/` - CLI interface (CmdGenie class)
  - `src/index.ts` - Main entry point and barrel exports
- **Entry Point**: `index.ts` (exports from src/)
- **Class**: `CmdGenie` class encapsulates CLI functionality
- **Config**: Stored in `~/.cmdgenie/config.json`
- **LLM Providers**: OpenAI, Anthropic, Google, Cohere (modular implementations)
- **Cross-Platform**: Uses `os.platform()` to detect OS

## Code Style Guidelines

### Access Modifiers
Use explicit access modifiers for all class members:
```typescript
export class ConfigManager {
    public Config: Config;           // Public property
    private _config: Config;          // Private property
    
    public LoadConfig(): Config {     // Public method
        // ...
    }
    
    private _LoadConfig(): Config {   // Private method
        // ...
    }
}
```

### Import Patterns
Use ES6 import statements (TypeScript):
```typescript
// Import from modules
import { CmdGenie } from './cli';
import { ConfigManager } from '../config';
import { Provider } from '../providers/base';
import { OpenAIProvider } from '../providers/openai';
import { Config, ProviderConfig } from '../types';

// Import built-in Node.js modules
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
    private readonly _providerRegistry: ProviderRegistry;

    constructor() {
        this._configManager = new ConfigManager();
        this._providerRegistry = new ProviderRegistry();
    }

    public get Config(): Config {
        return this._configManager.Config;
    }

    public async GenerateCommand(prompt: string): Promise<void> {
        // ...
    }

    private _CleanResponse(response: string): string {
        // ...
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
    provider: string;
    apiKey: string | null;
    model: string;
}

export interface ProviderConfig {
    defaultModel: string;
}

export interface Provider {
    Name: string;
    Execute(prompt: string, apiKey: string, model: string): Promise<string>;
}
```

Use type annotations for all function parameters and return types:
```typescript
public async GenerateCommand(prompt: string): Promise<void> {
    // ...
}

public UpdateLLM(provider: string, apiKey: string, model: string | null = null): boolean {
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
Load config with fallback to defaults (in ConfigManager):
```typescript
private _LoadConfig(): Config {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading config:', (error as Error).message);
    }
    return DEFAULT_CONFIG;
}
```

Save config with directory creation:
```typescript
public SaveConfig(): void {
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(this._config, null, 2));
    } catch (error) {
        console.error('Error saving config:', (error as Error).message);
    }
}
```

### LLM Provider Structure
Each provider is a separate class implementing the Provider interface:
```typescript
// src/providers/base.ts
export interface Provider {
    Name: string;
    Execute(prompt: string, apiKey: string, model: string): Promise<string>;
}

// src/providers/openai.ts
export class OpenAIProvider implements Provider {
    public readonly Name: string = 'openai';

    public async Execute(prompt: string, apiKey: string, model: string): Promise<string> {
        const response = await fetch(OPENAI_URL, {
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
                        content: `You are a command line expert...`
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
Include OS and shell detection for contextual command generation, and explicitly request omission of reasoning content:
```javascript
{
    role: 'system',
    content: `You are a command line expert. Generate only the exact command(s) needed for the user's request.
Respond with ONLY the command(s), no explanations or formatting.
Do not include any reasoning, thinking, or internal monologue content.
If multiple commands are needed, separate them with &&.
Detect the operating system and shell context and provide appropriate commands.
Current OS: ${GetOS()}, Current Shell: ${GetShell()}`
}
```

### Command Cleaning
Clean AI responses before execution, including reasoning content removal:
```javascript
// Remove code block formatting
let cleaned = response.replace(/```[\s\S]*?```/g, '').replace(/`/g, '');

// Remove reasoning/thinking tags (various formats)
cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
cleaned = cleaned.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');
cleaned = cleaned.replace(/<internal>[\s\S]*?<\/internal>/gi, '');

// Remove any remaining XML-like tags that might contain reasoning
cleaned = cleaned.replace(/<\w+>[\s\S]*?<\/\w+>/gi, '');

command = cleaned.trim();
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

## Security Guidelines

- **Never log API keys** in console output
- **Validate provider names** against allowed list
- **Store config in user home directory** (`~/.cmdgenie/`)
- **Show commands before execution** for user review
- **Use relative paths** in prompts, avoid exposing system paths

## File Organization

- **Source directory**: `src/` with modular structure
- **Compiled output** in `dist/` directory
- **Module structure**:
  - `src/types/` - Type definitions and interfaces
  - `src/config/` - Configuration management (ConfigManager)
  - `src/providers/` - LLM provider implementations
  - `src/cli/` - CLI interface (CmdGenie class)
  - `src/index.ts` - Main entry point
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
node dist/main.js add-provider mycustom custom your-api-key gpt-3.5-turbo https://api.example.com/v1/chat/completions

# Custom provider with different model
node dist/main.js add-provider mylocal custom your-api-key llama-3.1-8b http://localhost:8000/v1/chat/completions
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
