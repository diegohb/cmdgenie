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
See [nonfunctional-codebase spec](../specs/nonfunctional-codebase/spec.md) for comprehensive code style guidelines including:
- **Note**: The nonfunctional-codebase spec contains detailed code style patterns, TypeScript guidelines, naming conventions, and architectural patterns. This file defers to the spec to avoid duplication and serve as project-specific context.
- Import patterns (ES6 imports, modular structure)
- Naming conventions (PascalCase public, underscore+pascalCase private, UPPER_SNAKE_CASE constants)
- Access modifiers (explicit public/private for all class members)
- Error handling patterns
- Async/await usage
- Type annotations and interfaces
- Console output conventions with emojis
- Template literals for string formatting

### Architecture Patterns
See [nonfunctional-codebase spec](../specs/nonfunctional-codebase/spec.md) for architecture details:
- Modular `src/` directory structure (types, config, providers, cli)
- ConfigManager class for configuration management
- Provider interface and registry pattern for LLM providers
- CmdGenie class for CLI interface
- Interactive readline for command execution confirmation
- Config stored in `~/.cmdgenie/config.json`
- OS-aware command generation

### Testing Strategy
- **Jest testing framework** - Automated unit and integration testing
- Build first: `npm run build`
- Run tests: `npm test` for unit tests, `npm run test:integration` for integration tests
- Test via CLI: `node dist/index.js "your prompt"` or `npm link && cmdgenie "your prompt"`
- Test each LLM provider with actual API keys
- Verify cross-platform behavior on macOS, Windows, Linux
- Maintain >80% test coverage for core functionality

### Git Workflow
- Feature branches for changes (e.g., `add-new-provider`, `refactor-modular-structure`)
- Commit messages should be concise and descriptive
- Automated testing with Jest in CI/CD pipeline
- Oxlint linting runs before tests in CI/CD
- GitHub Actions used for testing and docs deployment to GitHub Pages

## Domain Context
- **Command Line Expertise**: Tool generates shell commands based on natural language
- **LLM Provider Registry**: Supports multiple LLM providers with persistent configuration management
- **LLM API Integration**: Each provider has unique API endpoints and response formats
- **Cross-Platform Commands**: Generated commands must work on detected OS (macOS, Linux, Windows)
- **Interactive Safety**: Commands shown before execution for user review
- **Command Cleaning**: AI responses may include markdown formatting that needs stripping
- **Provider Management**: CLI commands for adding, listing, switching, and removing LLM providers

## Important Constraints
- **Modular architecture**: All source code in `src/` directory with organized modules
- **TypeScript required**: Compile to JavaScript with `npm run build`
- **Jest testing framework**: Automated unit and integration testing required
- **Oxlint linting**: Automated code quality and style checking required
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
- **Jest**: Testing framework
- **Oxlint**: Code linting and style checking
- **@types/node**: TypeScript definitions for Node.js

Core dependencies are external APIs and testing tools - Node.js built-ins (fs, path, os, child_process, readline) used throughout.
