# Project Context

## Purpose
CmdGenie is an AI-powered command line tool that transforms natural language requests into precise command line instructions. It supports multiple LLM providers (OpenAI, Anthropic, Google, Cohere) and works across macOS, Windows, and Linux. Users can interactively generate and execute commands without needing to memorize complex CLI syntax.

## Tech Stack
- **Runtime**: Node.js >=14.0.0
- **Language**: TypeScript (compiled to JavaScript)
- **Package Manager**: npm
- **Architecture**: Modular source structure (`src/` directory)
- **Cross-platform**: Uses `os.platform()` for OS detection

## Project Conventions

### Code Style
See [AGENTS.md](../AGENTS.md) for comprehensive code style guidelines including:
- **Note**: AGENTS.md contains detailed code style patterns, TypeScript guidelines, naming conventions, and architectural patterns. This file defers to AGENTS.md to avoid duplication and serve as project-specific context.
- Import patterns (ES6 imports, modular structure)
- Naming conventions (PascalCase public, underscore+pascalCase private, UPPER_SNAKE_CASE constants)
- Access modifiers (explicit public/private for all class members)
- Error handling patterns
- Async/await usage
- Type annotations and interfaces
- Console output conventions with emojis
- Template literals for string formatting

### Architecture Patterns
See [AGENTS.md](../AGENTS.md) for architecture details:
- Modular `src/` directory structure (types, config, providers, cli)
- ConfigManager class for configuration management
- Provider interface and registry pattern for LLM providers
- CmdGenie class for CLI interface
- Interactive readline for command execution confirmation
- Config stored in `~/.cmdgenie/config.json`
- OS-aware command generation

### Testing Strategy
- **Manual testing only** - No automated test framework
- Build first: `npm run build`
- Test via CLI: `node dist/index.js "your prompt"` or `npm link && cmdgenie "your prompt"`
- Test each LLM provider with actual API keys
- Verify cross-platform behavior on macOS, Windows, Linux

### Git Workflow
- Feature branches for changes (e.g., `add-new-provider`, `refactor-modular-structure`)
- Commit messages should be concise and descriptive
- No automated CI/CD for testing (manual testing required)
- GitHub Actions used only for docs deployment to GitHub Pages

## Domain Context
- **Command Line Expertise**: Tool generates shell commands based on natural language
- **LLM API Integration**: Each provider has unique API endpoints and response formats
- **Cross-Platform Commands**: Generated commands must work on detected OS (macOS, Linux, Windows)
- **Interactive Safety**: Commands shown before execution for user review
- **Command Cleaning**: AI responses may include markdown formatting that needs stripping

## Important Constraints
- **Modular architecture**: All source code in `src/` directory with organized modules
- **TypeScript required**: Compile to JavaScript with `npm run build`
- **No test framework**: Manual CLI testing only
- **No linting**: Follow existing code style and TypeScript best practices
- **Node.js >=14.0.0**: Minimum required version
- **Security**: Never log API keys, validate providers, use safe config storage
- **Shebang required**: `#!/usr/bin/env node` at top of compiled `dist/index.js` for CLI execution
- **Explicit access modifiers**: All class members must have explicit public or private modifiers
- **Naming conventions**: PascalCase for public, underscore+pascalCase for private members

## External Dependencies
- **OpenAI API**: https://api.openai.com/v1/chat/completions
- **Anthropic API**: https://api.anthropic.com/v1/messages
- **Google AI API**: https://generativelanguage.googleapis.com/v1beta
- **Cohere API**: https://api.cohere.ai/v1/generate

All dependencies are external APIs - no npm packages beyond Node.js built-ins (fs, path, os, child_process, readline).
