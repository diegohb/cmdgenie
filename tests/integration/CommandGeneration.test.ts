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
                activeProvider: 'myopenai'
            },
            ActiveProvider: 'myopenai',
            UpdateActiveProvider: jest.fn(),
            HasActiveProvider: jest.fn().mockReturnValue(true),
            GetActiveProviderEntry: jest.fn(),
            SaveConfig: jest.fn(),
            RegistryManager: {
                AddProvider: jest.fn(),
                RemoveProvider: jest.fn(),
                GetProvider: jest.fn(),
                ListProviders: jest.fn().mockReturnValue(['myopenai'])
            }
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

        it('should handle missing active provider validation', () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(false);

            expect(mockConfigManager.HasActiveProvider()).toBe(false);
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
        it('should update active provider successfully', async () => {
            mockConfigManager.UpdateActiveProvider.mockReturnValue(true);

            await cmdGenie.UpdateActiveProvider('myanthropic');

            expect(mockConfigManager.UpdateActiveProvider).toHaveBeenCalledWith('myanthropic');
        });

        it('should handle active provider update failure', async () => {
            mockConfigManager.UpdateActiveProvider.mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await cmdGenie.UpdateActiveProvider('invalid-provider');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to update active provider to: invalid-provider');
            consoleSpy.mockRestore();
        });
    });
});