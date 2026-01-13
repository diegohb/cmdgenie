## MODIFIED Requirements
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