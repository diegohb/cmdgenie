## Context
Reasoning models like Minimax-M2.1, DeepSeek, and others include internal thinking/rationale in their responses, typically wrapped in XML-like tags such as `<think>...</think>`. This content is meant for the model's internal reasoning but can contaminate the command output sent to users.

## Goals / Non-Goals
- Goals: Clean reasoning content from responses, improve command execution reliability
- Non-Goals: Modify model behavior (handled via prompts), filter all non-command text

## Decisions
- **Prompt Enhancement**: Add explicit instruction to omit reasoning content alongside existing "ONLY commands" directive
- **Tag Removal**: Use regex to remove `<think>...</think>` blocks and similar patterns
- **Validation**: Add soft validation with warnings rather than hard blocking to allow flexibility
- **Backward Compatibility**: Maintain existing cleaning logic, add reasoning removal as additional step

## Risks / Trade-offs
- **Over-filtering**: Risk of removing legitimate command content if tags are misused
- **Model Variability**: Different models use different tag formats, may need ongoing updates
- **Performance**: Additional regex processing on every response (minimal impact)

## Migration Plan
1. Update system prompts to request reasoning omission
2. Implement reasoning tag removal in response cleaning
3. Add validation and warning system
4. Update tests and documentation
5. Monitor for new reasoning tag formats from providers