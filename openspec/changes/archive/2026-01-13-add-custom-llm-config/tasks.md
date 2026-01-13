## 1. Create Custom Provider Implementation
- [x] Create CustomProvider class implementing Provider interface
- [x] Add API call logic for custom endpoints (OpenAI-compatible)
- [x] Handle authentication and error responses for custom providers
- [x] Add CustomProviderConfig interface with name, model, apiKey, endpointUrl fields

## 2. Integrate with Provider Registry
- [x] Update --add-provider command to support custom provider type
- [x] Add custom provider validation and registration logic
- [x] Ensure custom providers are stored in provider registry
- [x] Add support for custom provider selection and activation

## 3. Update CLI Help and Validation
- [x] Update help text to document custom provider registration
- [x] Add input validation for custom provider parameters
- [x] Provide examples for custom provider setup
- [x] Add error messages for invalid custom endpoints

## 4. Update Documentation
- [x] Document supported API formats (OpenAI-compatible)
- [x] Add usage examples for custom provider registration
- [x] Update AGENTS.md with custom provider configuration
- [x] Include troubleshooting for common custom provider issues