## 1. Create Provider Registry System
- [ ] Create ProviderRegistry interface and file format
- [ ] Implement registry persistence in ~/.cmdgenie/providers.json
- [ ] Add registry loading and saving functionality
- [ ] Create ProviderEntry interface for stored provider data

## 2. Add Registry Management Commands
- [ ] Add --add-provider command for registering providers with API keys
- [ ] Add --list-providers command to show configured providers
- [ ] Add --remove-provider command for removing providers
- [ ] Add --show-provider command to display current provider details

## 3. Update Active Provider Selection
- [ ] Modify --update-llm to switch between registered providers
- [ ] Add validation that provider is registered before activation
- [ ] Update config.json to store only active provider reference
- [ ] Maintain backward compatibility for existing single-provider configs

## 4. Update Initialization Flow
- [ ] Add first-run detection and provider setup prompts
- [ ] Require at least one provider before allowing command generation
- [ ] Update error messages for missing provider registry
- [ ] Add migration logic for existing single-provider configs