# Change: Add Native Ollama Provider Support

## Why
Ollama enables running large language models locally, providing privacy, offline capability, and cost-free inference. Adding native Ollama support allows users to leverage local LLMs for command generation without internet dependency or API costs, expanding the tool's utility for offline work and privacy-conscious users.

## What Changes
- Add OllamaProvider class implementing the Provider interface
- Integrate with Ollama's REST API for local model inference
- Add Ollama to supported providers list
- Update provider registry and configuration
- Handle Ollama-specific API format and error responses

## Impact
- Affected specs: core
- Affected code: new provider implementation, registry updates
- No breaking changes to existing functionality