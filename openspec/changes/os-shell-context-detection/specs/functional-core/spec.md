## ADDED Requirements
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