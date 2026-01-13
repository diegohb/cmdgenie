import * as fs from 'fs';
import { CONFIG_DIR, CONFIG_FILE } from './constants';
import { Config, ProviderConfig, PROVIDERS } from '../types';

export class ConfigManager {
    private _config: Config;

    constructor() {
        this._config = this._LoadConfig();
    }

    public get Config(): Config {
        return this._config;
    }

    public get Provider(): string {
        return this._config.provider;
    }

    public get Model(): string {
        return this._config.model;
    }

    public get ApiKey(): string | null {
        return this._config.apiKey;
    }

    private _LoadConfig(): Config {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading config:', (error as Error).message);
        }

        return {
            provider: 'openai',
            apiKey: null,
            model: 'gpt-3.5-turbo'
        };
    }

    public SaveConfig(): void {
        try {
            if (!fs.existsSync(CONFIG_DIR)) {
                fs.mkdirSync(CONFIG_DIR, { recursive: true });
            }
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(this._config, null, 2));
        } catch (error) {
            console.error('Error saving config:', (error as Error).message);
        }
    }

    public UpdateLLM(provider: string, apiKey: string, model: string | null = null): boolean {
        if (!PROVIDERS[provider]) {
            console.error(`Unsupported provider: ${provider}`);
            console.log('Supported providers:', Object.keys(PROVIDERS).join(', '));
            return false;
        }

        this._config.provider = provider;
        this._config.apiKey = apiKey;
        this._config.model = model || PROVIDERS[provider].defaultModel;

        this.SaveConfig();
        console.log(`✅ LLM updated: ${provider} with model ${this._config.model}`);
        return true;
    }

    public HasApiKey(): boolean {
        return !!this._config.apiKey;
    }

    public GetProviderConfig(): ProviderConfig | undefined {
        return PROVIDERS[this._config.provider];
    }
}

export const DEFAULT_CONFIG: Config = {
    provider: 'openai',
    apiKey: null,
    model: 'gpt-3.5-turbo'
};
