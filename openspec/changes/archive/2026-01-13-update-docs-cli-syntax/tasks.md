## 1. Analyze Current Documentation
- [x] Review README.md for outdated CLI usage examples
- [x] Check AGENTS.md for CLI reference updates needed
- [x] Examine functional-core spec for CLI syntax scenarios
- [x] Identify all files referencing old CLI commands

## 2. Update README.md
- [x] Replace manual argument parsing examples with Commander commands
- [x] Add examples of interactive prompting
- [x] Update help output examples
- [x] Document new command structure (add-provider, list-providers, etc.)

## 3. Update Specification Files
- [x] Update functional-core scenarios to use correct CLI syntax
- [x] Ensure spec examples match actual Commander.js command structure
- [x] Verify all command references are accurate

## 4. Update Other Documentation
- [x] Update AGENTS.md if needed for CLI conventions
- [x] Check project.md for any CLI references
- [x] Update any inline code comments referencing old syntax

## 5. Validation and Testing
- [x] Test that documented commands work as described
- [x] Verify help output matches documentation
- [x] Run openspec validate to ensure spec changes are correct