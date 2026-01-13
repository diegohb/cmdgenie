## ADDED Requirements
### Requirement: Ollama Provider Support
The system SHALL support Ollama as a native provider for local LLM inference.

#### Scenario: Ollama provider registration
- **GIVEN** Ollama is running locally on default port
- **WHEN** user configures Ollama as provider
- **THEN** Ollama appears in supported providers list
- **AND** Configuration accepts Ollama model names
- **AND** API calls route to localhost:11434

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
- **WHEN** configuring Ollama provider
- **THEN** any valid Ollama model name is accepted
- **AND** Model availability is not pre-validated at config time
- **AND** Runtime errors handle unavailable models

#### Scenario: Offline operation
- **GIVEN** Ollama provider configured and service running
- **WHEN** user generates commands without internet
- **THEN** commands are generated using local model
- **AND** No external API calls are made
- **AND** Performance depends on local hardware