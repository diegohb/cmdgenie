# 🧞 CmdGenie - AI-Powered Command Generator

Transform natural language into precise command line instructions using AI. CmdGenie supports multiple LLM providers and works across macOS, Windows, and Linux.

## ✨ Features

- 🤖 Multiple LLM providers (OpenAI, Anthropic, Google, Cohere, Ollama, Custom)
- 🌍 Cross-platform support (macOS, Windows, Linux)
- 🔧 Configurable AI models and API keys
- 🚀 Interactive command execution
- 📝 Natural language to command translation
- 🧠 Reasoning content filtering (removes thinking tags from AI responses)
- 💾 Persistent configuration storage

## 🚀 Installation

### Via NPX (Recommended)
```bash
npx cmdgenie "find all directories"
```

### Global Installation
```bash
npm install -g cmdgenie
```

## 🔧 Setup

First, configure your LLM providers:

### OpenAI
```bash
cmdgenie add-provider openai openai sk-your-api-key-here
cmdgenie update-llm openai
```

### Anthropic (Claude)
```bash
cmdgenie add-provider anthropic anthropic your-api-key claude-3-haiku-20240307
cmdgenie update-llm anthropic
```

### Google (Gemini)
```bash
cmdgenie add-provider google google your-api-key gemini-pro
cmdgenie update-llm google
```

### Cohere
```bash
cmdgenie add-provider cohere cohere your-api-key command
cmdgenie update-llm cohere
```

### Ollama (Local)
```bash
cmdgenie add-provider ollama ollama your-api-key llama3.1
cmdgenie update-llm ollama
```

### Custom Provider
```bash
cmdgenie add-provider mycustom custom your-api-key gpt-3.5-turbo https://api.example.com/v1/chat/completions
cmdgenie update-llm mycustom
```

## 📖 Usage

### Basic Usage
```bash
cmdgenie "your natural language request"
```

### Examples
```bash
# File operations
cmdgenie "find all PDF files in current directory"
cmdgenie "delete all .log files older than 30 days"
cmdgenie "copy all images to backup folder"

# Process management
cmdgenie "kill process running on port 3000"
cmdgenie "show all running Python processes"

# System information
cmdgenie "show disk usage"
cmdgenie "display memory usage"
cmdgenie "list all installed packages"

# Network operations
cmdgenie "check if port 8080 is open"
cmdgenie "download file from URL"
```

### Help
```bash
cmdgenie --help
```

## 🔑 API Key Setup

### OpenAI
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Run: `cmdgenie add-provider openai openai sk-your-key`

### Anthropic
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Run: `cmdgenie add-provider anthropic anthropic your-key claude-3-haiku-20240307`

### Google AI
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Run: `cmdgenie add-provider google google your-key gemini-pro`

### Cohere
1. Go to [Cohere Dashboard](https://dashboard.cohere.ai/api-keys)
2. Create an API key
3. Run: `cmdgenie add-provider cohere cohere your-key command`

### Ollama (Local)
1. Install [Ollama](https://ollama.ai/) and pull a model
2. Run: `cmdgenie add-provider ollama ollama your-api-key llama3.1`

### Custom Provider
1. Ensure your API is OpenAI-compatible
2. Run: `cmdgenie add-provider mycustom custom your-api-key gpt-3.5-turbo https://api.example.com/v1/chat/completions`

## 🛠️ Configuration

Provider configurations are stored in `~/.cmdgenie/providers.json`:

```json
{
  "openai-default": {
    "name": "openai-default",
    "provider": "openai",
    "apiKey": "your-api-key",
    "model": "gpt-3.5-turbo",
    "endpointUrl": null
  }
}
```

Active provider is stored in `~/.cmdgenie/config.json`:

```json
{
  "activeProvider": "openai-default"
}
```

### Provider Management

```bash
# Add a provider
cmdgenie add-provider <name> <provider> <api-key> [model] [endpoint-url]

# List configured providers
cmdgenie list-providers

# Show provider details
cmdgenie show-provider <name>

# Set active provider
cmdgenie update-llm <provider-name>

# Remove a provider
cmdgenie remove-provider <name>
```

## 🔒 Security

- API keys are stored locally in your home directory
- No data is sent to external services except the configured LLM provider
- Commands are shown before execution for review

## 🛠️ Development

### Building from Source

This project uses TypeScript. After installing dependencies:

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues automatically (where possible)
npm run lint:fix

# Run tests (includes linting)
npm test

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run dev

# Clean build output
npm run clean
```

The compiled output is in `dist/index.js`, which is what gets installed and executed.

### Manual Testing

```bash
# Build first
npm run build

# Run the compiled CLI
node dist/main.js "find all directories"

# Or install globally
npm link
cmdgenie "show disk usage"
```

## 🤝 Contributing

We welcome contributions! This project uses OpenSpec for structured development and follows specific conventions for branching, committing, and code changes.

### Development Workflow

CmdGenie uses OpenSpec for managing changes and specifications. All significant changes must go through the OpenSpec workflow:

1. **Create a Change Proposal**: Use `openspec` commands to create structured proposals
2. **Implement Changes**: Follow the proposal's implementation plan
3. **Validate**: Ensure all requirements are met and tests pass
4. **Archive**: Move completed changes to archive

### Branching Strategy

We use feature branches for all development work:

- **Main branch**: `main` - production-ready code
- **Feature branches**: `add-<feature>`, `update-<feature>`, `refactor-<component>` (kebab-case, verb-led)
- **OpenSpec branches**: `openspec-proposals` - for active development work

**Branch Naming Examples:**
- `add-ollama-provider`
- `refactor-modular-structure`
- `update-readme-contribution-guidelines`
- `fix-memory-leak`

**Workflow:**
1. Create feature branch from `main`: `git checkout -b add-new-feature`
2. Work on changes following OpenSpec process
3. Push branch and create pull request
4. After review and merge, delete feature branch

### Commit Conventions

We follow conventional commit format for clear, structured commit messages:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `refactor`: Code restructuring without behavior change
- `test`: Testing-related changes
- `chore`: Maintenance tasks

**Examples:**
```
feat: implement Ollama provider support
docs: update README with contribution guidelines
refactor: split core spec into functional and nonfunctional
fix: resolve memory leak in provider registry
```

**Guidelines:**
- Use imperative mood ("implement" not "implemented")
- Keep subject line under 50 characters
- Use body for detailed explanations when needed
- Reference issue numbers when applicable

### OpenSpec Workflow

All changes must be proposed and tracked using OpenSpec:

#### 1. Creating a Proposal
```bash
# Check existing changes
openspec list

# Create new change proposal
openspec [create new change with proper structure]
```

Each proposal includes:
- `proposal.md`: Why and what changes
- `tasks.md`: Implementation checklist
- `specs/[capability]/spec.md`: Specification deltas

#### 2. Implementation
- Follow `tasks.md` checklist sequentially
- Run `openspec validate [change-id] --strict` regularly
- Ensure tests pass: `npm test`
- Run linting: `npm run lint`

#### 3. Validation & Archive
```bash
# Final validation
openspec validate [change-id] --strict

# Archive completed change
openspec archive [change-id] --yes
```

### Code Style Guidelines

- **TypeScript**: Strict typing with explicit access modifiers
- **Naming**: PascalCase for public members, underscore+pascalCase for private
- **Architecture**: Modular structure in `src/` directory
- **Testing**: Jest framework with >80% coverage target
- **Linting**: Oxlint for code quality

See `AGENTS.md` and `openspec/project.md` for detailed conventions.

### Getting Started

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/your-username/cmdgenie.git
   cd cmdgenie
   ```

2. **Setup Development Environment**:
   ```bash
   npm install
   npm run build
   npm test
   ```

3. **Understand the Codebase**:
   - Read `openspec/project.md` for project context
   - Check `openspec/specs/` for current specifications
   - Review `AGENTS.md` for development guidelines

4. **Make Changes**:
   - Create OpenSpec proposal for significant changes
   - Follow branching and commit conventions
   - Add tests for new functionality
   - Update documentation as needed

### Testing

- Run full test suite: `npm test`
- Integration tests: `npm run test:integration`
- Manual testing: `npm run build && node dist/index.js "your prompt"`
- Cross-platform testing on macOS, Windows, Linux

### Pull Request Process

1. **Create PR**: Push your feature branch and create a pull request
2. **Description**: Include OpenSpec change ID and link to proposal
3. **Review**: Address review feedback
4. **Merge**: After approval, squash merge to maintain clean history
5. **Cleanup**: Delete feature branch after merge

### Need Help?

- Check existing OpenSpec proposals: `openspec list`
- Read specifications: `openspec show [spec-name]`
- Review archived changes for examples
- Open an issue for questions or clarifications

## 📜 License

MIT License - see LICENSE file for details

## 🐛 Issues

Report issues at: [Issues](https://github.com/cmdgenie/cmdgenie/issues)
Email(pranavubarhande.business@gmail.com): [Gmail](mailto:pranavubarhande.business@gmail.com)
GitHub(https://github.com/pranavubarhande): [GitHub](https://github.com/pranavubarhande)

## 🔄 Changelog

### v1.0.0
- Initial release
- Support for OpenAI, Anthropic, Google, and Cohere
- Cross-platform compatibility
- Interactive command execution