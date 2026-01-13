import * as fs from 'fs';
import { CONFIG_DIR, CONFIG_FILE, PROVIDERS_FILE } from './constants';
import { Config, PROVIDERS, ProviderRegistry, ProviderEntry } from '../types';

export class ConfigManager {
    private _config: Config;
    private _registryManager: ProviderRegistryManager;

    constructor() {
        this._registryManager = new ProviderRegistryManager();
        this._config = this._LoadConfig();
    }

    public get Config(): Config {
        return this._config;
    }

    public get ActiveProvider(): string {
        return this._config.activeProvider;
    }

    public get RegistryManager(): ProviderRegistryManager {
        return this._registryManager;
    }

    private _LoadConfig(): Config {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));

                // Migration: if old format with provider/apiKey/model, migrate to registry
                if (data.provider && data.apiKey) {
                    console.log('🔄 Migrating legacy config to provider registry...');
                    const defaultName = `${data.provider}-default`;
                    this._registryManager.AddProvider(defaultName, data.provider, data.apiKey, data.model);
                    // Save new config format
                    const newConfig = { activeProvider: defaultName };
                    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
                    return newConfig;
                }

                // New format
                return data;
            }
        } catch (error) {
            console.error('Error loading config:', (error as Error).message);
        }

        return {
            activeProvider: ''
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

    public UpdateActiveProvider(providerName: string): boolean {
        if (!this._registryManager.GetProvider(providerName)) {
            console.error(`Provider '${providerName}' not found in registry`);
            console.log('Available providers:', this._registryManager.ListProviders().join(', '));
            return false;
        }

        this._config.activeProvider = providerName;
        this.SaveConfig();
        console.log(`✅ Active provider updated to: ${providerName}`);
        return true;
    }

    public HasActiveProvider(): boolean {
        return !!this._config.activeProvider && !!this._registryManager.GetProvider(this._config.activeProvider);
    }

    public GetActiveProviderEntry(): ProviderEntry | undefined {
        return this._registryManager.GetProvider(this._config.activeProvider);
    }

    // Legacy method for backward compatibility - to be removed after migration
    public UpdateLLM(provider: string, apiKey: string, model: string | null = null): boolean {
        console.warn('UpdateLLM is deprecated. Use provider registry commands instead.');
        // For migration, create a default provider if registry is empty
        if (Object.keys(this._registryManager.Registry).length === 0) {
            const defaultName = `${provider}-default`;
            this._registryManager.AddProvider(defaultName, provider, apiKey, model || PROVIDERS[provider].defaultModel);
            this._config.activeProvider = defaultName;
            this.SaveConfig();
            return true;
        }
        return false;
    }
}

export const DEFAULT_CONFIG: Config = {
    activeProvider: ''
};

export class ProviderRegistryManager {
    private _registry: ProviderRegistry;

    constructor() {
        this._registry = this._LoadRegistry();
    }

    public get Registry(): ProviderRegistry {
        return this._registry;
    }

    private _LoadRegistry(): ProviderRegistry {
        try {
            if (fs.existsSync(PROVIDERS_FILE)) {
                return JSON.parse(fs.readFileSync(PROVIDERS_FILE, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading provider registry:', (error as Error).message);
        }

        return {};
    }

    public SaveRegistry(): void {
        try {
            if (!fs.existsSync(CONFIG_DIR)) {
                fs.mkdirSync(CONFIG_DIR, { recursive: true });
            }
            fs.writeFileSync(PROVIDERS_FILE, JSON.stringify(this._registry, null, 2));
        } catch (error) {
            console.error('Error saving provider registry:', (error as Error).message);
        }
    }

    public AddProvider(name: string, provider: string, apiKey: string, model: string, endpointUrl?: string): boolean {
        if (this._registry[name]) {
            console.error(`Provider '${name}' already exists`);
            return false;
        }

        if (!PROVIDERS[provider]) {
            console.error(`Unsupported provider: ${provider}`);
            console.log('Supported providers:', Object.keys(PROVIDERS).join(', '));
            return false;
        }

        this._registry[name] = {
            name,
            provider,
            apiKey,
            model: model || PROVIDERS[provider].defaultModel,
            endpointUrl
        };

        this.SaveRegistry();
        console.log(`✅ Provider '${name}' added: ${provider} with model ${this._registry[name].model}`);
        return true;
    }

    public RemoveProvider(name: string): boolean {
        if (!this._registry[name]) {
            console.error(`Provider '${name}' not found`);
            return false;
        }

        delete this._registry[name];
        this.SaveRegistry();
        console.log(`✅ Provider '${name}' removed`);
        return true;
    }

    public GetProvider(name: string): ProviderEntry | undefined {
        return this._registry[name];
    }

    public ListProviders(): string[] {
        return Object.keys(this._registry);
    }
}
