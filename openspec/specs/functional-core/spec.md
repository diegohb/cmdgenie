# Functional-Core Specification

## Purpose
This specification defines the functional requirements for CmdGenie's core product features, focusing on LLM provider management, CLI commands, and user-facing functionality.
## Requirements
### Requirement: Provider Registry Persistence
The system SHALL maintain a persistent registry of configured LLM providers with their credentials.

#### Scenario: Registry file creation
- **GIVEN** user runs first provider registration command
- **WHEN** provider is successfully registered
- **THEN** ~/.cmdgenie/providers.json is created
- **AND** provider credentials are stored securely
- **AND** registry persists across sessions

#### Scenario: Multiple provider support
- **GIVEN** registry supports multiple providers
- **WHEN** user registers additional providers
- **THEN** all providers are stored in registry
- **AND** each provider maintains independent credentials
- **AND** providers can be listed and managed individually

#### Scenario: Registry integrity
- **GIVEN** registry file exists
- **WHEN** application starts
- **THEN** registry is loaded and validated
- **AND** corrupted entries are handled gracefully
- **AND** missing registry triggers setup flow

### Requirement: Provider Management Commands
The CLI SHALL provide commands for managing the provider registry.

#### Scenario: Add provider command
- **GIVEN** user wants to register a new provider
- **WHEN** user runs `--add-provider <type> <name> [options]`
- **THEN** provider is validated and added to registry
- **AND** API key is prompted or provided securely
- **AND** success confirmation is shown

#### Scenario: List providers command
- **GIVEN** providers are registered
- **WHEN** user runs `--list-providers`
- **THEN** all registered providers are displayed
- **AND** active provider is highlighted
- **AND** provider types and names are shown

#### Scenario: Switch active provider
- **GIVEN** multiple providers are registered
- **WHEN** user runs `--update-llm <provider-name>`
- **THEN** active provider is switched to the specified provider
- **AND** validation ensures provider exists in registry
- **AND** success confirmation is shown

#### Scenario: Remove provider command
- **GIVEN** user wants to remove a provider
- **WHEN** user runs `--remove-provider <name>`
- **THEN** provider is removed from registry
- **AND** confirmation is shown
- **AND** if it was active, user is prompted to choose new active provider

#### Scenario: Show provider command
- **GIVEN** user wants to see provider details
- **WHEN** user runs `--show-provider <name>`
- **THEN** provider information is displayed
- **AND** credentials are masked for security

### Requirement: Ollama Provider Support
The system SHALL support Ollama as a native provider for local LLM inference.

#### Scenario: Ollama provider registration
- **GIVEN** Ollama is running locally on default port
- **WHEN** user configures Ollama as provider
- **THEN** Ollama appears in supported providers list
- **AND** Configuration accepts Ollama model names
- **AND** API calls route to localhost:11434

#### Scenario: Ollama model setting
- **GIVEN** Ollama provider is registered
- **WHEN** user runs `--update-llm ollama --model <model-name>`
- **THEN** specified model is stored in provider configuration
- **AND** Model is used for subsequent command generation
- **AND** Success confirmation shows configured model

#### Scenario: Ollama command generation
- **GIVEN** Ollama provider is configured with available model
- **WHEN** user requests command generation
- **THEN** API request is sent to Ollama generate endpoint
- **AND** Response is parsed correctly
- **AND** Generated command follows same cleaning rules

#### Scenario: Ollama error handling
- **GIVEN** Ollama service is not running
- **WHEN** command generation is attempted
- **THEN** connection error is handled gracefully
- **AND** User receives helpful error message
- **AND** Fallback suggestions are provided

### Requirement: Local Model Compatibility
The Ollama provider SHALL work with various local models available through Ollama.

#### Scenario: Model selection
- **GIVEN** user has multiple Ollama models installed
- **WHEN** configuring Ollama provider with `--update-llm ollama --model <model-name>`
- **THEN** specified model name is accepted and stored
- **AND** Model availability is validated at runtime
- **AND** Runtime errors handle unavailable models gracefully

#### Scenario: Default model fallback
- **GIVEN** Ollama provider configured without explicit model
- **WHEN** command generation is requested
- **THEN** system uses first available model or shows helpful error
- **AND** User is prompted to specify model if none available

#### Scenario: Offline operation
- **GIVEN** Ollama provider configured and service running
- **WHEN** user generates commands without internet
- **THEN** commands are generated using local model
- **AND** No external API calls are made
- **AND** Performance depends on local hardware</content>
<parameter name="filePath">openspec/changes/ollama-model-setting-support/specs/functional-core/spec.md

### Requirement: Custom LLM Provider Support
The system SHALL allow users to register custom LLM providers with their own API endpoints, models, and authentication.

#### Scenario: Custom provider registration
- **GIVEN** user has a compatible LLM API endpoint
- **WHEN** user runs `cmdgenie --add-provider custom <name> --endpoint <url> --model <model> --api-key <key>`
- **THEN** custom provider is stored in provider registry
- **AND** provider is available for selection and command generation
- **AND** configuration persists across sessions

#### Scenario: Custom provider usage
- **GIVEN** custom provider is registered in registry
- **WHEN** user selects custom provider and runs command generation
- **THEN** API calls are made to custom endpoint
- **AND** Custom model and authentication are used
- **AND** Response parsing works with OpenAI-compatible format

#### Scenario: Custom provider validation
- **GIVEN** custom provider registration attempt
- **WHEN** user provides invalid endpoint or missing required fields
- **THEN** validation error is shown
- **AND** Provider is not registered
- **AND** Helpful error message guides user to correct format

### Requirement: Custom Provider Registry Integration
The provider registry SHALL support custom providers alongside built-in providers.

#### Scenario: Registry storage
- **GIVEN** custom provider registration
- **WHEN** provider is added to registry
- **THEN** custom providers are stored in ~/.cmdgenie/providers.json
- **AND** Registry includes custom provider entries with endpoint, model, apiKey
- **AND** Custom providers appear in --list-providers output

#### Scenario: Provider activation
- **GIVEN** custom provider registered in registry
- **WHEN** user runs `--update-llm <custom-provider-name>`
- **THEN** custom provider becomes active
- **AND** Configuration references the selected custom provider
- **AND** Command generation uses custom provider settings

### Requirement: First-Run Setup Flow
The system SHALL guide users through initial provider setup on first use.

#### Scenario: First run detection
- **GIVEN** no registry file exists
- **WHEN** user attempts command generation
- **THEN** setup flow is triggered
- **AND** user is prompted to add at least one provider
- **AND** command generation is blocked until setup completes

#### Scenario: Migration from single provider
- **GIVEN** existing config.json with single provider
- **WHEN** application detects legacy config
- **THEN** provider is migrated to registry format
- **AND** backward compatibility is maintained
- **AND** user is notified of migration</content>
<parameter name="filePath">openspec/specs/nonfunctional-codebase/spec.md

### Requirement: OS Detection
The system SHALL detect the current operating system and include it in the LLM prompt.

#### Scenario: Windows OS Detection
- **WHEN** the application runs on Windows
- **THEN** the OS context is set to 'win32' in the prompt

#### Scenario: Linux OS Detection
- **WHEN** the application runs on Linux
- **THEN** the OS context is set to 'linux' in the prompt

### Requirement: Shell Detection
The system SHALL detect the current shell type and include it in the LLM prompt.

#### Scenario: Bash Shell Detection
- **WHEN** the shell is bash
- **THEN** the shell context is set to 'bash' in the prompt

#### Scenario: PowerShell Detection
- **WHEN** the shell is PowerShell
- **THEN** the shell context is set to 'powershell' in the prompt

### Requirement: Context Inclusion in Prompts
The system SHALL include detected OS and shell in the system prompt sent to the LLM provider.

#### Scenario: Prompt Enhancement
- **WHEN** generating a command
- **THEN** the system prompt includes "Current OS: {os}, Current Shell: {shell}"

### Requirement: Testing OS and Shell Detection
The system SHALL have tests to ensure OS and shell detection works correctly.

#### Scenario: Test OS Detection
- **WHEN** tests run
- **THEN** OS detection logic is verified

#### Scenario: Test Shell Detection
- **WHEN** tests run
- **THEN** shell detection logic is verified

#### Scenario: Test Prompt Inclusion
- **WHEN** tests run
- **THEN** context is included in generated prompts

