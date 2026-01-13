## 1. Update System Prompts
- [ ] Modify system prompt template in types/index.ts to include reasoning omission instruction
- [ ] Verify all providers use the updated prompt (OpenAI, Anthropic, Google, Cohere, Ollama, Custom)
- [ ] Test prompt changes don't break existing functionality

## 2. Enhance Response Cleaning
- [ ] Add reasoning tag removal to _CleanResponse method in CmdGenie
- [ ] Handle various reasoning tag formats (`<think>`, `</think>`, etc.)
- [ ] Ensure cleaning preserves actual command content
- [ ] Add validation to detect and warn about non-command content

## 3. Add Response Validation
- [ ] Create validation function to check for reasoning content in responses
- [ ] Add warnings when reasoning content is detected
- [ ] Ensure validation doesn't block valid multi-command responses

## 4. Update Tests
- [ ] Add test cases for reasoning tag removal
- [ ] Test various reasoning tag formats
- [ ] Verify validation warnings for contaminated responses
- [ ] Update existing provider tests to include reasoning content scenarios

## 5. Documentation Updates
- [ ] Update AI_INSTRUCTIONS.md to document reasoning content handling
- [ ] Add examples of reasoning model response cleaning