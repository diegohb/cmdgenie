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

            consoleSpy.mockRestore();
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
});