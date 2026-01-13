# Change: OS and Shell Context Detection

## Why
To improve the accuracy of command generation by providing OS and shell context to the LLM provider, ensuring commands are tailored to the user's environment.

## What Changes
- Detect the current operating system (using os.platform())
- Detect the type of shell (e.g., bash, zsh, cmd, powershell)
- Include this context in the system prompt sent to the LLM provider
- Add tests to verify detection and inclusion in prompts

## Impact
- Affected specs: functional-core
- Affected code: src/cli/, src/providers/