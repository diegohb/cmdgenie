import { Provider, ProviderConstructor } from './base';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { GoogleProvider } from './google';
import { CohereProvider } from './cohere';
import { OllamaProvider } from './ollama';
import { CustomProvider } from './custom';
import { PROVIDERS } from '../types';

export class ProviderRegistry {
    private _providers: Map<string, ProviderConstructor>;

    constructor() {
        this._providers = new Map();
        this._RegisterDefaultProviders();
    }

    private _RegisterDefaultProviders(): void {
        this._providers.set('openai', OpenAIProvider);
        this._providers.set('anthropic', AnthropicProvider);
        this._providers.set('google', GoogleProvider);
        this._providers.set('cohere', CohereProvider);
        this._providers.set('ollama', OllamaProvider);
        this._providers.set('custom', CustomProvider);
    }

    public GetProvider(name: string): Provider | null {
        const Constructor = this._providers.get(name);
        if (!Constructor) {
            return null;
        }
        return new Constructor();
    }

    public GetProviderNames(): string[] {
        return Array.from(this._providers.keys());
    }

    public HasProvider(name: string): boolean {
        return this._providers.has(name);
    }

    public GetDefaultModel(provider: string): string {
        const config = PROVIDERS[provider];
        return config?.defaultModel || '';
    }
}

export const _registry: ProviderRegistry = new ProviderRegistry();
