## 1. Planning and Preparation
- [ ] 1.1 Review current single-file structure and identify logical modules
- [ ] 1.2 Design new directory structure under src/
- [ ] 1.3 Identify all public vs private members across the codebase
- [ ] 1.4 Plan access modifier strategy for each module

## 2. Create Directory Structure
- [ ] 2.1 Create src/ directory
- [ ] 2.2 Create src/types/ for type definitions
- [ ] 2.3 Create src/config/ for configuration management
- [ ] 2.4 Create src/providers/ for LLM provider implementations
- [ ] 2.5 Create src/cli/ for CLI interface and command handling
- [ ] 2.6 Create src/utils/ for utility functions

## 3. Extract Types Module
- [ ] 3.1 Move all interfaces to src/types/index.ts
- [ ] 3.2 Add explicit `public` to exported types
- [ ] 3.3 Add `internal` to provider response types if not externally exposed
- [ ] 3.4 Add `export` statements for all public types

## 4. Extract Config Module
- [ ] 4.1 Move CONFIG_DIR, CONFIG_FILE constants to src/config/constants.ts
- [ ] 4.2 Create ConfigManager class in src/config/index.ts
- [ ] 4.3 Rename methods with PascalCase public access (LoadConfig, SaveConfig)
- [ ] 4.4 Make helper methods private with underscore+pascalCase (e.g., _validateConfig)
- [ ] 4.5 Add explicit `public` and `private` modifiers

## 5. Extract Providers Module
- [ ] 5.1 Create provider interface in src/types/providers.ts
- [ ] 5.2 Create base Provider class in src/providers/base.ts
- [ ] 5.3 Extract OpenAI provider to src/providers/openai.ts
- [ ] 5.4 Extract Anthropic provider to src/providers/anthropic.ts
- [ ] 5.5 Extract Google provider to src/providers/google.ts
- [ ] 5.6 Extract Cohere provider to src/providers/cohere.ts
- [ ] 5.7 Rename all methods to PascalCase with explicit public/private modifiers
- [ ] 5.8 Make provider-specific implementations private (e.g., _callOpenAI)
- [ ] 5.9 Create provider registry in src/providers/registry.ts

## 6. Extract CLI Module
- [ ] 6.1 Create CLIHandler class in src/cli/index.ts
- [ ] 6.2 Move command generation logic to CLIHandler
- [ ] 6.3 Move help display to CLIHandler
- [ ] 6.4 Move interactive execution to CLIHandler
- [ ] 6.5 Rename methods with PascalCase public access
- [ ] 6.6 Make internal methods private with underscore+pascalCase

## 7. Create Main Entry Point
- [ ] 7.1 Refactor index.ts to import from modules
- [ ] 7.2 Keep main() function as entry point
- [ ] 7.3 Export public API from CmdGenie class
- [ ] 7.4 Ensure all necessary exports are present

## 8. Update Build Configuration
- [ ] 8.1 Update tsconfig.json to include src/ directory
- [ ] 8.2 Configure outDir to dist/
- [ ] 8.3 Update package.json build scripts
- [ ] 8.4 Test build process compiles correctly

## 9. Update Documentation
- [ ] 9.1 Update AGENTS.md with modular architecture guidelines
- [ ] 9.2 Update project.md to reflect modular structure
- [ ] 9.3 Document naming conventions (PascalCase public, underscore+pascalCase private)
- [ ] 9.4 Document access modifier usage
- [ ] 9.5 Add module organization description

## 10. Testing
- [ ] 10.1 Build the project successfully
- [ ] 10.2 Test CLI help command
- [ ] 10.3 Test LLM update command
- [ ] 10.4 Test command generation with each provider
- [ ] 10.5 Verify cross-platform compatibility
- [ ] 10.6 Ensure no TypeScript errors
