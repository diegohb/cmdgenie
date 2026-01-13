# Change: Add Custom LLM Provider Support

## Why
Users currently can only configure the built-in LLM providers (OpenAI, Anthropic, Google, Cohere). Adding support for custom/user-provided LLM providers will enable users to integrate with any compatible API endpoint, including self-hosted models or enterprise LLM services. This increases flexibility and adoption.

## What Changes
- Add support for registering custom LLM providers via --add-provider command
- Create CustomProvider class for OpenAI-compatible API endpoints
- Integrate custom providers with the provider registry system
- Support custom name, model, API key, and endpoint URL parameters
- Update help text and validation for custom providers

## Impact
- Affected specs: core
- Affected code: new CustomProvider class, CLI interface, provider registry
- Depends on: add-provider-registry
- No breaking changes to existing functionality