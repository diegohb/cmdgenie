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
        configManager = new ConfigManager();
    });

    describe('constructor and loading config', () => {
        it('should load existing config file', () => {
            const mockConfig: Config = {
                provider: 'anthropic',
                apiKey: 'test-key',
                model: 'claude-3-haiku-20240307'
            };

            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

            const newConfigManager = new ConfigManager();

            expect(mockedFs.existsSync).toHaveBeenCalled();
            expect(mockedFs.readFileSync).toHaveBeenCalled();
            expect(newConfigManager.Config).toEqual(mockConfig);
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
                provider: 'openai',
                apiKey: 'test-api-key',
                model: 'gpt-4'
            }));
            configManager = new ConfigManager();
        });

        it('should return provider', () => {
            expect(configManager.Provider).toBe('openai');
        });

        it('should return model', () => {
            expect(configManager.Model).toBe('gpt-4');
        });

        it('should return api key', () => {
            expect(configManager.ApiKey).toBe('test-api-key');
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

    describe('UpdateLLM', () => {
        beforeEach(() => {
            mockedFs.existsSync.mockReturnValue(true);
        });

        it('should update config with valid provider', () => {
            const result = configManager.UpdateLLM('anthropic', 'new-api-key');

            expect(result).toBe(true);
            expect(configManager.Provider).toBe('anthropic');
            expect(configManager.ApiKey).toBe('new-api-key');
            expect(configManager.Model).toBe('claude-3-haiku-20240307'); // default model
            expect(mockedFs.writeFileSync).toHaveBeenCalled();
        });

        it('should update config with custom model', () => {
            const result = configManager.UpdateLLM('openai', 'api-key', 'gpt-4');

            expect(result).toBe(true);
            expect(configManager.Model).toBe('gpt-4');
        });

        it('should reject invalid provider', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const result = configManager.UpdateLLM('invalid-provider', 'api-key');

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('Unsupported provider: invalid-provider');

            consoleSpy.mockRestore();
        });
    });

    describe('HasApiKey', () => {
        it('should return true when api key exists', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            }));

            const newConfigManager = new ConfigManager();
            expect(newConfigManager.HasApiKey()).toBe(true);
        });

        it('should return false when api key is null', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                provider: 'openai',
                apiKey: null,
                model: 'gpt-3.5-turbo'
            }));

            const newConfigManager = new ConfigManager();
            expect(newConfigManager.HasApiKey()).toBe(false);
        });
    });

    describe('GetProviderConfig', () => {
        it('should return provider config for valid provider', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            }));

            const newConfigManager = new ConfigManager();
            const providerConfig = newConfigManager.GetProviderConfig();

            expect(providerConfig).toEqual({ defaultModel: 'gpt-3.5-turbo' });
        });

        it('should return undefined for invalid provider', () => {
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(JSON.stringify({
                provider: 'invalid',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            }));

            const newConfigManager = new ConfigManager();
            const providerConfig = newConfigManager.GetProviderConfig();

            expect(providerConfig).toBeUndefined();
        });
    });
});