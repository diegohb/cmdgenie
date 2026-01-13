# Change: Add Persistent Provider Registry

## Why
Currently, provider configuration is minimal and doesn't support multiple configured providers. Adding a persistent provider registry allows users to pre-configure multiple LLM providers (built-in and custom) with their API keys, then easily switch between them. This improves user experience by separating provider setup from active selection, and enables better management of multiple provider accounts.

## What Changes
- Create separate provider registry file (~/.cmdgenie/providers.json)
- Add registry commands for managing provider configurations
- Keep existing --update-llm command for switching active provider
- Require initial provider setup before use
- Support multiple providers with stored credentials

## Impact
- Affected specs: core
- Affected code: config management, CLI commands, provider initialization
- Breaking change: requires initial provider setup on first use