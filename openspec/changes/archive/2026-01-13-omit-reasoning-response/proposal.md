# Change: Omit Reasoning Content in LLM Responses

## Why
Some LLM providers (particularly reasoning models like Minimax-M2.1) include thinking/rationale content in their responses, often wrapped in tags like `<think>...</think>`. This content should not be executed as commands. The system needs to explicitly request that providers omit reasoning content and clean responses to remove any thinking tags before command execution.

## What Changes
- Update system prompts across all providers to explicitly request omission of reasoning/thinking content
- Enhance response cleaning logic to remove `<think>...</think>` tags and similar reasoning content
- Add validation to ensure cleaned responses don't contain non-command content
- Update tests to verify reasoning content is properly omitted

## Impact
- Affected specs: functional-core (command generation and response processing)
- Affected code: All provider system prompts and response cleaning in CmdGenie.GenerateCommand
- Breaking changes: None (improved response quality)