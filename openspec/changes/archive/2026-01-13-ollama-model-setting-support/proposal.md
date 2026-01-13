# Change: Ollama Model Setting Support

## Why
Currently, when configuring Ollama providers via --update-llm, users cannot specify which model to use, limiting the flexibility of local LLM inference. This change enables users to set the model during provider updates for better Ollama integration.

## What Changes
- Modify Ollama provider requirements to support optional model parameter in --update-llm command
- Update command generation scenarios to use specified models
- Add validation for model availability at runtime

## Impact
- Affected specs: functional-core
- Affected code: CLI interface, provider management, Ollama provider implementation</content>
<parameter name="filePath">openspec/changes/ollama-model-setting-support/proposal.md