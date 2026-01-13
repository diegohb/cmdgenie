## ADDED Requirements
### Requirement: Custom LLM Provider Support
The system SHALL allow users to register custom LLM providers with their own API endpoints, models, and authentication.

#### Scenario: Custom provider registration
- **GIVEN** user has a compatible LLM API endpoint
- **WHEN** user runs `cmdgenie --register-provider <name> <endpoint> <model> <api-key>`
- **THEN** custom provider is stored in configuration
- **AND** provider is available for command generation
- **AND** configuration persists across sessions

#### Scenario: Custom provider usage
- **GIVEN** custom provider is registered
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

### Requirement: Extended Configuration Schema
The configuration system SHALL support multiple custom providers alongside built-in providers.

#### Scenario: Configuration storage
- **GIVEN** custom provider registration
- **WHEN** configuration is saved
- **THEN** custom providers are stored in ~/.cmdgenie/config.json
- **AND** Configuration schema includes customProviders array
- **AND** Each custom provider has name, endpointUrl, model, apiKey fields

#### Scenario: Provider switching
- **GIVEN** multiple custom providers registered
- **WHEN** user switches between providers
- **THEN** configuration updates correctly
- **AND** New provider settings take effect immediately
- **AND** Previous provider settings are preserved