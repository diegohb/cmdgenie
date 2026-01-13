# Change: Add Custom LLM Configuration Command

## Why
Users currently can only configure the built-in LLM providers (OpenAI, Anthropic, Google, Cohere). Adding support for custom/user-provided LLM providers will enable users to integrate with any compatible API endpoint, including self-hosted models or enterprise LLM services. This increases flexibility and adoption.

## What Changes
- Extend config command to accept custom provider registration
- Add support for custom name, model, API key, and endpoint URL parameters
- Update configuration schema to store custom provider details
- Modify provider registry to handle custom providers dynamically
- Update help text and validation

## Impact
- Affected specs: core
- Affected code: config management, CLI interface, provider registry
- No breaking changes to existing provider configurations