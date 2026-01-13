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
- **GIVEN** multiple providers registered
- **WHEN** user runs `--update-llm <provider-name>`
- **THEN** active provider is switched
- **AND** config.json is updated with active provider reference
- **AND** new provider settings take effect immediately

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
- **AND** user is notified of migration