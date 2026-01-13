# Project Context

## Purpose
CmdGenie is an AI-powered command line tool that transforms natural language requests into precise command line instructions. It supports multiple LLM providers (OpenAI, Anthropic, Google, Cohere) and works across macOS, Windows, and Linux. Users can interactively generate and execute commands without needing to memorize complex CLI syntax.

## Tech Stack
- **Runtime**: Node.js >=14.0.0
- **Language**: TypeScript (compiled to JavaScript)
- **Package Manager**: npm
- **Architecture**: Single-file CLI tool
- **Cross-platform**: Uses `os.platform()` for OS detection

## Project Conventions

### Code Style
See [AGENTS.md](../AGENTS.md) for comprehensive code style guidelines including:
- Import patterns (ES6 imports, TypeScript)
- Naming conventions (PascalCase classes/interfaces, camelCase methods, UPPER_SNAKE_CASE constants)
- Error handling patterns
- Async/await usage
- Type annotations and interfaces
- Console output conventions with emojis
- Template literals for string formatting

### Architecture Patterns
See [AGENTS.md](../AGENTS.md) for architecture details:
- Single `CmdGenie` class encapsulating all functionality
- Dedicated methods per LLM provider (`callOpenAI`, `callAnthropic`, etc.)
- Config management with load/save methods
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
- Feature branches for changes (e.g., `add-new-provider`, `fix-command-cleaning`)
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
- **Single-file architecture**: Keep all code in `index.ts` - no modularization
- **TypeScript required**: Compile to JavaScript with `npm run build`
- **No test framework**: Manual CLI testing only
- **No linting**: Follow existing code style and TypeScript best practices
- **Node.js >=14.0.0**: Minimum required version
- **Security**: Never log API keys, validate providers, use safe config storage
- **Shebang required**: `#!/usr/bin/env node` at top of compiled `dist/index.js` for CLI execution

## External Dependencies
- **OpenAI API**: https://api.openai.com/v1/chat/completions
- **Anthropic API**: https://api.anthropic.com/v1/messages
- **Google AI API**: https://generativelanguage.googleapis.com/v1beta
- **Cohere API**: https://api.cohere.ai/v1/generate

All dependencies are external APIs - no npm packages beyond Node.js built-ins (fs, path, os, child_process, readline).
