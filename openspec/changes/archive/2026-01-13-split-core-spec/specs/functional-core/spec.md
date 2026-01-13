## ADDED Requirements

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
- **AND** credentials are masked for security</content>
<parameter name="filePath">openspec/changes/split-core-spec/specs/functional-core/spec.md