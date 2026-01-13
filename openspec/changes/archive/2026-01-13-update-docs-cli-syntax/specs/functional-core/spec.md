## MODIFIED Requirements
### Requirement: Custom LLM Provider Support
The system SHALL allow users to register custom LLM providers with their own API endpoints, models, and authentication.

#### Scenario: Custom provider registration
- **GIVEN** user has a compatible LLM API endpoint
- **WHEN** user runs `cmdgenie add-provider <name> custom <api-key> <model> <endpoint-url>`
- **THEN** custom provider is stored in provider registry
- **AND** provider is available for selection and command generation
- **AND** configuration persists across sessions