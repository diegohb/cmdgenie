## ADDED Requirements
### Requirement: Response Cleaning and Reasoning Content Handling
The system SHALL clean LLM responses to remove reasoning/thinking content before command execution.

#### Scenario: Remove thinking tags
- **GIVEN** LLM response contains `<think>rationale content</think> command`
- **WHEN** response is processed for execution
- **THEN** thinking tags and content are removed
- **AND** only the command portion is retained

#### Scenario: Handle various reasoning formats
- **GIVEN** response with reasoning content in different formats (XML tags, markdown, etc.)
- **WHEN** cleaning is applied
- **THEN** all reasoning content is removed regardless of format
- **AND** command extraction works reliably

#### Scenario: Preserve multi-command responses
- **GIVEN** response contains `command1 && command2` without reasoning
- **WHEN** cleaning is applied
- **THEN** multi-command structure is preserved
- **AND** no valid command content is removed

#### Scenario: Warn on reasoning contamination
- **GIVEN** response contains reasoning content that wasn't removed
- **WHEN** command validation occurs
- **THEN** warning is logged about potential reasoning contamination
- **AND** command execution proceeds with cleaned content