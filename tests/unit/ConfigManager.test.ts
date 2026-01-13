import { ConfigManager, DEFAULT_CONFIG } from '../../src/config';
import { Config } from '../../src/types';

// Mock fs module
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn()
}));

import * as fs from 'fs';

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('ConfigManager', () => {
    let configManager: ConfigManager;

    beforeEach(() => {
        jest.clearAllMocks();
        // By default, neither config nor providers files exist
        mockedFs.existsSync.mockReturnValue(false);
        // Reset writeFileSync to not throw by default
        mockedFs.writeFileSync.mockImplementation(() => {});
        configManager = new ConfigManager();
    });

    describe('constructor and loading config', () => {
        it('should load existing new format config file', () => {
            const mockConfig: Config = {
                activeProvider: 'myopenai'
            };

            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

            const newConfigManager = new ConfigManager();

            expect(mockedFs.existsSync).toHaveBeenCalled();
            expect(mockedFs.readFileSync).toHaveBeenCalled();
            expect(newConfigManager.Config).toEqual(mockConfig);
        });

        it('should migrate old format config to registry', () => {
            const oldConfig = {
                provider: 'anthropic',
                apiKey: 'test-key',
                model: 'claude-3-haiku-20240307'
            };

            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify(oldConfig));
            mockedFs.writeFileSync.mockImplementation(() => {});

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const newConfigManager = new ConfigManager();

            expect(consoleSpy).toHaveBeenCalledWith('🔄 Migrating legacy config to provider registry...');
            expect(newConfigManager.Config.activeProvider).toBe('anthropic-default');
            expect(newConfigManager.RegistryManager.GetProvider('anthropic-default')).toEqual({
                name: 'anthropic-default',
                provider: 'anthropic',
                apiKey: 'test-key',
                model: 'claude-3-haiku-20240307'
            });

            consoleSpy.mockRestore();
        });

        it('should return default config when file does not exist', () => {
            mockedFs.existsSync.mockReturnValue(false);

            const newConfigManager = new ConfigManager();

            expect(mockedFs.existsSync).toHaveBeenCalled();
            expect(newConfigManager.Config).toEqual(DEFAULT_CONFIG);
        });

        it('should handle JSON parse errors gracefully', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockImplementation(() => {
                throw new Error('Invalid JSON');
            });

            // Mock console.error to avoid test output
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const newConfigManager = new ConfigManager();

            expect(consoleSpy).toHaveBeenCalledWith('Error loading config:', 'Invalid JSON');
            expect(newConfigManager.Config).toEqual(DEFAULT_CONFIG);

            consoleSpy.mockRestore();
        });
    });

    describe('getters', () => {
        beforeEach(() => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                activeProvider: 'myopenai'
            }));
            configManager = new ConfigManager();
        });

        it('should return active provider', () => {
            expect(configManager.ActiveProvider).toBe('myopenai');
        });
    });

    describe('SaveConfig', () => {
        beforeEach(() => {
            mockedFs.existsSync.mockReturnValue(false);
        });

        it('should create config directory if it does not exist', () => {
            mockedFs.existsSync.mockReturnValue(false);

            configManager.SaveConfig();

            expect(mockedFs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
            expect(mockedFs.writeFileSync).toHaveBeenCalled();
        });

        it('should save config to file', () => {
            mockedFs.existsSync.mockReturnValue(true);

            configManager.SaveConfig();

            expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
                expect.any(String),
                JSON.stringify(DEFAULT_CONFIG, null, 2)
            );
        });

        it('should handle save errors gracefully', () => {
            mockedFs.writeFileSync.mockImplementation(() => {
                throw new Error('Write failed');
            });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            configManager.SaveConfig();

            expect(consoleSpy).toHaveBeenCalledWith('Error saving config:', 'Write failed');
            expect(mockedFs.writeFileSync).toHaveBeenCalled();

            consoleSpy.mockRestore();
            // Restore the default mock
            mockedFs.writeFileSync.mockImplementation(() => {});
        });
    });

    describe('UpdateActiveProvider', () => {
        beforeEach(() => {
            mockedFs.existsSync.mockReturnValue(true);
            // Mock registry having a provider
            configManager.RegistryManager.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');
        });

        it('should update active provider with valid provider name', () => {
            const result = configManager.UpdateActiveProvider('test-provider');

            expect(result).toBe(true);
            expect(configManager.ActiveProvider).toBe('test-provider');
            expect(mockedFs.writeFileSync).toHaveBeenCalled();
        });

        it('should reject invalid provider name', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const result = configManager.UpdateActiveProvider('invalid-provider');

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('Provider \'invalid-provider\' not found in registry');

            consoleSpy.mockRestore();
        });
    });

    describe('HasActiveProvider', () => {
        it('should return true when active provider is set and exists in registry', () => {
            configManager.RegistryManager.AddProvider('existing-provider', 'openai', 'test-key', 'gpt-4');
            configManager.UpdateActiveProvider('existing-provider');

            expect(configManager.HasActiveProvider()).toBe(true);
        });

        it('should return false when active provider is not set', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                activeProvider: ''
            }));

            const newConfigManager = new ConfigManager();
            expect(newConfigManager.HasActiveProvider()).toBe(false);
        });

        it('should return false when active provider does not exist in registry', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                activeProvider: 'nonexistent'
            }));

            const newConfigManager = new ConfigManager();
            expect(newConfigManager.HasActiveProvider()).toBe(false);
        });
    });

    describe('GetActiveProviderEntry', () => {
        it('should return provider entry for active provider', () => {
            configManager.RegistryManager.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');
            configManager.UpdateActiveProvider('test-provider');

            const entry = configManager.GetActiveProviderEntry();

            expect(entry).toEqual({
                name: 'test-provider',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-4'
            });
        });

        it('should return undefined when no active provider', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                activeProvider: ''
            }));

            const newConfigManager = new ConfigManager();
            const entry = newConfigManager.GetActiveProviderEntry();

            expect(entry).toBeUndefined();
        });
    });

    describe('UpdateLLM (legacy method)', () => {
        beforeEach(() => {
            // Ensure fs operations succeed for these tests
            mockedFs.writeFileSync.mockImplementation(() => {});
        });

        it('should create default provider and set active when registry is empty', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            const result = configManager.UpdateLLM('anthropic', 'test-key', 'claude-3-haiku');

            expect(result).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith('UpdateLLM is deprecated. Use provider registry commands instead.');
            expect(configManager.ActiveProvider).toBe('anthropic-default');
            expect(configManager.RegistryManager.GetProvider('anthropic-default')).toEqual({
                name: 'anthropic-default',
                provider: 'anthropic',
                apiKey: 'test-key',
                model: 'claude-3-haiku'
            });

            consoleSpy.mockRestore();
        });

        it('should return false when registry is not empty', () => {
            configManager.RegistryManager.AddProvider('existing', 'openai', 'key', 'gpt-4');
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            const result = configManager.UpdateLLM('anthropic', 'test-key');

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('UpdateLLM is deprecated. Use provider registry commands instead.');

            consoleSpy.mockRestore();
        });

        it('should use default model when model is null', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            configManager.UpdateLLM('openai', 'test-key', null);

            expect(configManager.RegistryManager.GetProvider('openai-default')?.model).toBe('gpt-3.5-turbo');

            consoleSpy.mockRestore();
        });
    });

    describe('Registry getter', () => {
        it('should return the registry manager instance', () => {
            expect(configManager.RegistryManager).toBeDefined();
            expect(typeof configManager.RegistryManager.AddProvider).toBe('function');
        });
    });

    describe('ProviderRegistryManager', () => {
        beforeEach(() => {
            // Ensure fs operations succeed for these tests
            mockedFs.writeFileSync.mockImplementation(() => {});
        });

        describe('AddProvider error cases', () => {
            it('should reject adding provider that already exists', () => {
                configManager.RegistryManager.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

                const result = configManager.RegistryManager.AddProvider('test-provider', 'anthropic', 'key2', 'claude');

                expect(result).toBe(false);
                expect(consoleSpy).toHaveBeenCalledWith('Provider \'test-provider\' already exists');

                consoleSpy.mockRestore();
            });

            it('should reject unsupported provider', () => {
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
                const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

                const result = configManager.RegistryManager.AddProvider('test-provider', 'unsupported', 'key', 'model');

                expect(result).toBe(false);
                expect(consoleSpy).toHaveBeenCalledWith('Unsupported provider: unsupported');
                expect(consoleLogSpy).toHaveBeenCalledWith('Supported providers:', 'openai, anthropic, google, cohere, ollama, custom');

                consoleSpy.mockRestore();
                consoleLogSpy.mockRestore();
            });

            it('should reject custom provider without endpoint URL', () => {
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
                const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

                const result = configManager.RegistryManager.AddProvider('test-provider', 'custom', 'key', 'model');

                expect(result).toBe(false);
                expect(consoleSpy).toHaveBeenCalledWith('Custom provider requires an endpoint URL');
                expect(consoleLogSpy).toHaveBeenCalledWith('Example: cmdgenie --add-provider mycustom custom api-key model https://api.example.com/v1/chat/completions');

                consoleSpy.mockRestore();
                consoleLogSpy.mockRestore();
            });
        });

        describe('RemoveProvider', () => {
            it('should remove existing provider successfully', () => {
                configManager.RegistryManager.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');

                const result = configManager.RegistryManager.RemoveProvider('test-provider');

                expect(result).toBe(true);
                expect(configManager.RegistryManager.GetProvider('test-provider')).toBeUndefined();
            });

            it('should handle removing non-existent provider', () => {
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

                const result = configManager.RegistryManager.RemoveProvider('nonexistent');

                expect(result).toBe(false);
                expect(consoleSpy).toHaveBeenCalledWith('Provider \'nonexistent\' not found');

                consoleSpy.mockRestore();
            });
        });

        describe('ListProviders and GetProvider', () => {
            it('should list all providers', () => {
                configManager.RegistryManager.AddProvider('provider1', 'openai', 'key1', 'gpt-4');
                configManager.RegistryManager.AddProvider('provider2', 'anthropic', 'key2', 'claude');

                const providers = configManager.RegistryManager.ListProviders();

                expect(providers).toContain('provider1');
                expect(providers).toContain('provider2');
                expect(providers.length).toBe(2);
            });

            it('should get provider by name', () => {
                configManager.RegistryManager.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');

                const provider = configManager.RegistryManager.GetProvider('test-provider');

                expect(provider).toEqual({
                    name: 'test-provider',
                    provider: 'openai',
                    apiKey: 'test-key',
                    model: 'gpt-4'
                });
            });

            it('should return undefined for non-existent provider', () => {
                const provider = configManager.RegistryManager.GetProvider('nonexistent');

                expect(provider).toBeUndefined();
            });
        });
    });
});