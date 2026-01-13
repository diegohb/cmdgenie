## 1. Create Custom Provider Implementation
- [ ] Create CustomProvider class implementing Provider interface
- [ ] Add API call logic for custom endpoints (OpenAI-compatible)
- [ ] Handle authentication and error responses for custom providers
- [ ] Add CustomProviderConfig interface with name, model, apiKey, endpointUrl fields

## 2. Integrate with Provider Registry
- [ ] Update --add-provider command to support custom provider type
- [ ] Add custom provider validation and registration logic
- [ ] Ensure custom providers are stored in provider registry
- [ ] Add support for custom provider selection and activation

## 3. Update CLI Help and Validation
- [ ] Update help text to document custom provider registration
- [ ] Add input validation for custom provider parameters
- [ ] Provide examples for custom provider setup
- [ ] Add error messages for invalid custom endpoints

## 4. Update Documentation
- [ ] Document supported API formats (OpenAI-compatible)
- [ ] Add usage examples for custom provider registration
- [ ] Update AGENTS.md with custom provider configuration
- [ ] Include troubleshooting for common custom provider issues