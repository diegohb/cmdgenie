## 1. Update System Prompts
- [x] Modify system prompt template in types/index.ts to include reasoning omission instruction
- [x] Verify all providers use the updated prompt (OpenAI, Anthropic, Google, Cohere, Ollama, Custom)
- [x] Test prompt changes don't break existing functionality

## 2. Enhance Response Cleaning
- [x] Add reasoning tag removal to _CleanResponse method in CmdGenie
- [x] Handle various reasoning tag formats (`<think>`, `</think>`, etc.)
- [x] Ensure cleaning preserves actual command content
- [x] Add validation to detect and warn about non-command content

## 3. Add Response Validation
- [x] Create validation function to check for reasoning content in responses
- [x] Add warnings when reasoning content is detected
- [x] Ensure validation doesn't block valid multi-command responses

## 4. Update Tests
- [x] Add test cases for reasoning tag removal
- [x] Test various reasoning tag formats
- [x] Verify validation warnings for contaminated responses
- [x] Update existing provider tests to include reasoning content scenarios

## 5. Documentation Updates
- [x] Update AI_INSTRUCTIONS.md to document reasoning content handling
- [x] Add examples of reasoning model response cleaning