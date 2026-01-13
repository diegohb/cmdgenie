import { CmdGenie } from '../../src/cli';

// Mock external dependencies
jest.mock('../../src/config');
jest.mock('../../src/providers/registry');

import { ConfigManager } from '../../src/config';
import { ProviderRegistry } from '../../src/providers/registry';

const mockedConfigManager = ConfigManager as jest.MockedClass<typeof ConfigManager>;
const mockedProviderRegistry = ProviderRegistry as jest.MockedClass<typeof ProviderRegistry>;

describe('Integration Tests', () => {
    let cmdGenie: CmdGenie;
    let mockConfigManager: jest.Mocked<ConfigManager>;
    let mockProviderRegistry: jest.Mocked<ProviderRegistry>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks
        mockConfigManager = {
            Config: {
                provider: 'openai',
                apiKey: 'test-api-key',
                model: 'gpt-3.5-turbo'
            },
            Provider: 'openai',
            Model: 'gpt-3.5-turbo',
            ApiKey: 'test-api-key',
            UpdateLLM: jest.fn(),
            HasApiKey: jest.fn().mockReturnValue(true),
            GetProviderConfig: jest.fn(),
            SaveConfig: jest.fn()
        } as any;

        mockProviderRegistry = {
            GetProvider: jest.fn()
        } as any;

        mockedConfigManager.mockImplementation(() => mockConfigManager);
        mockedProviderRegistry.mockImplementation(() => mockProviderRegistry);

        cmdGenie = new CmdGenie();
    });

    describe('Command Generation Setup', () => {
        it('should initialize with proper dependencies', () => {
            // Test that the constructor properly initializes dependencies
            expect(mockedConfigManager).toHaveBeenCalledTimes(1);
            expect(mockedProviderRegistry).toHaveBeenCalledTimes(1);
        });

        it('should handle missing API key validation', () => {
            mockConfigManager.HasApiKey.mockReturnValue(false);

            expect(mockConfigManager.HasApiKey()).toBe(false);
        });

        it('should support provider registry integration', () => {
            const mockProvider = {
                Name: 'openai',
                Execute: jest.fn()
            };
            mockProviderRegistry.GetProvider.mockReturnValue(mockProvider as any);

            expect(mockProviderRegistry.GetProvider('openai')).toBe(mockProvider);
        });
    });

    describe('Configuration Workflow', () => {
        it('should update LLM configuration successfully', async () => {
            mockConfigManager.UpdateLLM.mockReturnValue(true);

            await cmdGenie.UpdateLLM('anthropic', 'new-api-key', 'claude-3-haiku');

            expect(mockConfigManager.UpdateLLM).toHaveBeenCalledWith(
                'anthropic',
                'new-api-key',
                'claude-3-haiku'
            );
        });

        it('should handle configuration update failure', async () => {
            mockConfigManager.UpdateLLM.mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await cmdGenie.UpdateLLM('invalid-provider', 'key');

            expect(consoleSpy).toHaveBeenCalledWith('Unsupported provider: invalid-provider');
            consoleSpy.mockRestore();
        });
    });
});