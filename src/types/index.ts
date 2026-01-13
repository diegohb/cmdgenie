import * as os from 'os';

export interface ProviderConfig {
    defaultModel: string;
}

export interface ProviderEntry {
    name: string;
    provider: string;
    apiKey: string;
    model: string;
    endpointUrl?: string;
}

export interface ProviderRegistry {
    [providerName: string]: ProviderEntry;
}

export interface Config {
    activeProvider: string;
}

export interface Provider {
    Name: string;
    Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string>;
}

export const PROVIDERS: Record<string, ProviderConfig> = {
    'openai': { defaultModel: 'gpt-3.5-turbo' },
    'anthropic': { defaultModel: 'claude-3-haiku-20240307' },
    'google': { defaultModel: 'gemini-pro' },
    'cohere': { defaultModel: 'command' },
    'ollama': { defaultModel: 'llama3.1' },
    'custom': { defaultModel: 'gpt-3.5-turbo' }
};

export function GetOS(): string {
    return os.platform();
}

export function GetShell(): string {
    if (os.platform() === 'win32') {
        // Check if running in PowerShell
        if (process.env.PSModulePath) {
            return 'powershell';
        }
        return 'cmd';
    } else {
        // Unix-like systems
        return process.env.SHELL?.split('/').pop() || 'bash';
    }
}

export const OPENAI_MODEL: string = 'gpt-3.5-turbo';
export const ANTHROPIC_MODEL: string = 'claude-3-haiku-20240307';
export const GOOGLE_MODEL: string = 'gemini-pro';
export const COHERE_MODEL: string = 'command';
export const OLLAMA_MODEL: string = 'llama3.1';

export const OPENAI_URL: string = 'https://api.openai.com/v1/chat/completions';
export const ANTHROPIC_URL: string = 'https://api.anthropic.com/v1/messages';
export const GOOGLE_URL: string = 'https://generativelanguage.googleapis.com/v1beta/models';
export const COHERE_URL: string = 'https://api.cohere.ai/v1/generate';
export const OLLAMA_URL: string = 'http://localhost:11434/api/generate';

const MAX_TOKENS: number = 150;
const TEMPERATURE: number = 0.1;
const COHERE_MAX_TOKENS: number = 100;

export { MAX_TOKENS, TEMPERATURE, COHERE_MAX_TOKENS };

export type {
    OpenAIResponse,
    AnthropicResponse,
    GoogleResponse,
    CohereResponse,
    OllamaResponse
} from './providers';
