## ADDED Requirements
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