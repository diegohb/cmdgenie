## 1. Extend Config Schema
- [ ] Update Config interface to support custom providers
- [ ] Add CustomProvider interface with name, model, apiKey, endpointUrl fields
- [ ] Update ConfigManager to handle custom provider storage
- [ ] Add validation for custom provider configurations

## 2. Update CLI Interface
- [ ] Modify UpdateLLM method to accept custom provider parameters
- [ ] Add new command-line flags for custom provider registration
- [ ] Update help text to document custom provider options
- [ ] Add input validation for custom provider data

## 3. Enhance Provider Registry
- [ ] Update ProviderRegistry to dynamically register custom providers
- [ ] Create CustomProvider class implementing Provider interface
- [ ] Add API call logic for custom endpoints (OpenAI-compatible)
- [ ] Handle authentication and error responses for custom providers

## 4. Update Documentation
- [ ] Update CLI help text with custom provider examples
- [ ] Add usage examples for custom provider registration
- [ ] Document supported API formats (OpenAI-compatible)
- [ ] Update AGENTS.md with custom provider configuration