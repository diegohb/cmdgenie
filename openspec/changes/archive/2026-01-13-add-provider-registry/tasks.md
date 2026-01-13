## 1. Create Provider Registry System
- [x] Create ProviderRegistry interface and file format
- [x] Implement registry persistence in ~/.cmdgenie/providers.json
- [x] Add registry loading and saving functionality
- [x] Create ProviderEntry interface for stored provider data

## 2. Add Registry Management Commands
- [x] Add --add-provider command for registering providers with API keys
- [x] Add --list-providers command to show configured providers
- [x] Add --remove-provider command for removing providers
- [x] Add --show-provider command to display current provider details

## 3. Update Active Provider Selection
- [x] Modify --update-llm to switch between registered providers
- [x] Add validation that provider is registered before activation
- [x] Update config.json to store only active provider reference
- [x] Maintain backward compatibility for existing single-provider configs

## 4. Update Initialization Flow
- [x] Add first-run detection and provider setup prompts
- [x] Require at least one provider before allowing command generation
- [x] Update error messages for missing provider registry
- [x] Add migration logic for existing single-provider configs