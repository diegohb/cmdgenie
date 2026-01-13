import { CmdGenie } from '../../src/cli';
import { ConfigManager } from '../../src/config';
import { ProviderRegistry } from '../../src/providers/registry';
import { OpenAIProvider } from '../../src/providers/openai';

// Mock dependencies
jest.mock('../../src/config');
jest.mock('../../src/providers/registry');
jest.mock('readline');

import * as readline from 'readline';

const mockedConfigManager = ConfigManager as jest.MockedClass<typeof ConfigManager>;
const mockedProviderRegistry = ProviderRegistry as jest.MockedClass<typeof ProviderRegistry>;
const mockedReadline = readline as jest.Mocked<typeof readline>;

describe('CmdGenie', () => {
    let cmdGenie: CmdGenie;
    let mockConfigManager: jest.Mocked<ConfigManager>;
    let mockProviderRegistry: jest.Mocked<ProviderRegistry>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup ConfigManager mock
        const mockListProviders = jest.fn().mockReturnValue([]);
        const mockAddProvider = jest.fn() as jest.MockedFunction<any>;
        const mockRemoveProvider = jest.fn();
        const mockGetProvider = jest.fn();
        mockConfigManager = {
            Config: {
                activeProvider: 'myopenai'
            },
            ActiveProvider: 'myopenai',
            UpdateActiveProvider: jest.fn(),
            HasActiveProvider: jest.fn(),
            GetActiveProviderEntry: jest.fn(),
            SaveConfig: jest.fn(),
            RegistryManager: {
                AddProvider: mockAddProvider,
                RemoveProvider: mockRemoveProvider,
                GetProvider: mockGetProvider,
                ListProviders: mockListProviders
            }
        } as any;

        // Setup ProviderRegistry mock
        mockProviderRegistry = {
            GetProvider: jest.fn()
        } as any;

        mockedConfigManager.mockImplementation(() => mockConfigManager);
        mockedProviderRegistry.mockImplementation(() => mockProviderRegistry);

        cmdGenie = new CmdGenie();
    });

    describe('constructor', () => {
        it('should initialize with ConfigManager and ProviderRegistry', () => {
            expect(mockedConfigManager).toHaveBeenCalledTimes(1);
            expect(mockedProviderRegistry).toHaveBeenCalledTimes(1);
        });
    });

    describe('Config getter', () => {
        it('should return config from ConfigManager', () => {
            expect(cmdGenie.Config).toEqual(mockConfigManager.Config);
        });
    });

    describe('UpdateActiveProvider', () => {
        it('should call ConfigManager UpdateActiveProvider with success', async () => {
            mockConfigManager.UpdateActiveProvider.mockReturnValue(true);

            await cmdGenie.UpdateActiveProvider('myopenai');

            expect(mockConfigManager.UpdateActiveProvider).toHaveBeenCalledWith('myopenai');
        });

        it('should handle UpdateActiveProvider failure', async () => {
            mockConfigManager.UpdateActiveProvider.mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await cmdGenie.UpdateActiveProvider('invalid');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to update active provider to: invalid');
            consoleSpy.mockRestore();
        });
    });

    describe('GenerateCommand', () => {
        let consoleLogSpy: jest.SpyInstance;
        let consoleErrorSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        });

        afterEach(() => {
            consoleLogSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        it('should error when no active provider is configured', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(false);
            (mockConfigManager.RegistryManager.ListProviders as jest.Mock).mockReturnValue([]);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ No providers configured. This appears to be your first run.');
            expect(consoleLogSpy).not.toHaveBeenCalledWith('🤖 Generating command...');
        });

        it('should generate command successfully', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            mockProviderRegistry.GetProvider.mockReturnValue(new OpenAIProvider());

            const mockProvider = mockProviderRegistry.GetProvider('openai') as OpenAIProvider;
            mockProvider.Execute = jest.fn().mockResolvedValue('ls -la');

            // Mock readline
            const mockRl = {
                question: jest.fn(),
                close: jest.fn()
            };
            mockedReadline.createInterface.mockReturnValue(mockRl as any);

            await cmdGenie.GenerateCommand('list files');

            expect(consoleLogSpy).toHaveBeenCalledWith('🤖 Generating command...');
            expect(consoleLogSpy).toHaveBeenCalledWith('\n💡 Generated command: ls -la');

            // Check that readline was created for user confirmation
            expect(mockedReadline.createInterface).toHaveBeenCalledWith({
                input: process.stdin,
                output: process.stdout
            });
        });

        it('should handle unsupported provider', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            mockProviderRegistry.GetProvider.mockReturnValue(null);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error generating command:', 'Unsupported provider: openai');
        });

        it('should handle provider execution errors', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            const mockProvider = new OpenAIProvider();
            mockProvider.Execute = jest.fn().mockRejectedValue(new Error('API Error'));
            mockProviderRegistry.GetProvider.mockReturnValue(mockProvider);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error generating command:', 'API Error');
        });

        it('should clean markdown from command response', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            const mockProvider = {
                Name: 'openai',
                Execute: jest.fn().mockResolvedValue('```\nls -la\n```')
            };
            mockProviderRegistry.GetProvider.mockReturnValue(mockProvider as any);

            const mockRl = {
                question: jest.fn(),
                close: jest.fn()
            };
            mockedReadline.createInterface.mockReturnValue(mockRl as any);

            await cmdGenie.GenerateCommand('list files');

            expect(mockProvider.Execute).toHaveBeenCalledWith('list files', 'test-key', 'gpt-3.5-turbo', undefined);
            // The command should be cleaned of markdown
            expect(consoleLogSpy).toHaveBeenCalledWith('\n💡 Generated command: ls -la');
        });

        it('should clean reasoning tags from command response', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            const mockProvider = {
                Name: 'openai',
                Execute: jest.fn().mockResolvedValue('<think>I need to list files</think>ls -la')
            };
            mockProviderRegistry.GetProvider.mockReturnValue(mockProvider as any);

            const mockRl = {
                question: jest.fn(),
                close: jest.fn()
            };
            mockedReadline.createInterface.mockReturnValue(mockRl as any);

            await cmdGenie.GenerateCommand('list files');

            // The reasoning content should be removed
            expect(consoleLogSpy).toHaveBeenCalledWith('\n💡 Generated command: ls -la');
        });

        it('should warn when reasoning content is detected in response', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            const mockProvider = {
                Name: 'openai',
                Execute: jest.fn().mockResolvedValue('ls -la but I think this might not work')
            };
            mockProviderRegistry.GetProvider.mockReturnValue(mockProvider as any);

            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            const mockRl = {
                question: jest.fn(),
                close: jest.fn()
            };
            mockedReadline.createInterface.mockReturnValue(mockRl as any);

            await cmdGenie.GenerateCommand('list files');

            expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️  Warning: Response may contain reasoning content that was not fully cleaned');

            consoleWarnSpy.mockRestore();
        });
    });

    describe('ShowHelp', () => {
        it('should display help information', () => {
            mockConfigManager.GetActiveProviderEntry.mockReturnValue({
                name: 'myopenai',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            cmdGenie.ShowHelp();

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🧞 CmdGenie - AI-Powered Command Generator'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Active Provider: myopenai'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Provider Type: openai'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Model: gpt-3.5-turbo'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('API Key: ✅ Set'));

            consoleSpy.mockRestore();
        });
    });

    describe('AddProvider', () => {
        it('should call ConfigManager RegistryManager AddProvider with success', () => {
            (mockConfigManager.RegistryManager.AddProvider as jest.Mock).mockReturnValue(true);

            cmdGenie.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');

            expect(mockConfigManager.RegistryManager.AddProvider).toHaveBeenCalledWith('test-provider', 'openai', 'test-key', 'gpt-4', undefined);
        });

        it('should handle AddProvider failure', () => {
            (mockConfigManager.RegistryManager.AddProvider as jest.Mock).mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            cmdGenie.AddProvider('test-provider', 'openai', 'test-key', 'gpt-4');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to add provider: test-provider');

            consoleSpy.mockRestore();
        });
    });

    describe('ListProviders', () => {
        it('should list all providers when providers exist', () => {
            (mockConfigManager.RegistryManager.ListProviders as jest.Mock).mockReturnValue(['provider1', 'provider2']);
            (mockConfigManager.RegistryManager.GetProvider as jest.Mock)
                .mockReturnValueOnce({
                    name: 'provider1',
                    provider: 'openai',
                    apiKey: 'key1',
                    model: 'gpt-4'
                })
                .mockReturnValueOnce({
                    name: 'provider2',
                    provider: 'anthropic',
                    apiKey: 'key2',
                    model: 'claude'
                });
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            cmdGenie.ListProviders();

            expect(consoleSpy).toHaveBeenCalledWith('Configured providers:');
            expect(consoleSpy).toHaveBeenCalledWith('  provider1: openai (gpt-4)');
            expect(consoleSpy).toHaveBeenCalledWith('  provider2: anthropic (claude)');

            consoleSpy.mockRestore();
        });

        it('should handle no providers configured', () => {
            (mockConfigManager.RegistryManager.ListProviders as jest.Mock).mockReturnValue([]);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            cmdGenie.ListProviders();

            expect(consoleSpy).toHaveBeenCalledWith('No providers configured.');

            consoleSpy.mockRestore();
        });
    });

    describe('RemoveProvider', () => {
        it('should call ConfigManager RegistryManager RemoveProvider with success', () => {
            (mockConfigManager.RegistryManager.RemoveProvider as jest.Mock).mockReturnValue(true);

            cmdGenie.RemoveProvider('test-provider');

            expect(mockConfigManager.RegistryManager.RemoveProvider).toHaveBeenCalledWith('test-provider');
        });

        it('should handle RemoveProvider failure', () => {
            (mockConfigManager.RegistryManager.RemoveProvider as jest.Mock).mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            cmdGenie.RemoveProvider('test-provider');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to remove provider: test-provider');

            consoleSpy.mockRestore();
        });
    });

    describe('ShowProvider', () => {
        it('should display provider details when provider exists', () => {
            (mockConfigManager.RegistryManager.GetProvider as jest.Mock).mockReturnValue({
                name: 'test-provider',
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-4',
                endpointUrl: 'https://api.example.com'
            });
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            cmdGenie.ShowProvider('test-provider');

            expect(consoleSpy).toHaveBeenCalledWith('Provider: test-provider');
            expect(consoleSpy).toHaveBeenCalledWith('  Type: openai');
            expect(consoleSpy).toHaveBeenCalledWith('  Model: gpt-4');
            expect(consoleSpy).toHaveBeenCalledWith('  API Key: ✅ Set');
            expect(consoleSpy).toHaveBeenCalledWith('  Endpoint: https://api.example.com');

            consoleSpy.mockRestore();
        });

        it('should handle provider not found', () => {
            (mockConfigManager.RegistryManager.GetProvider as jest.Mock).mockReturnValue(undefined);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            cmdGenie.ShowProvider('nonexistent');

            expect(consoleSpy).toHaveBeenCalledWith('Provider \'nonexistent\' not found');

            consoleSpy.mockRestore();
        });

        it('should show API key not set when no key', () => {
            (mockConfigManager.RegistryManager.GetProvider as jest.Mock).mockReturnValue({
                name: 'test-provider',
                provider: 'openai',
                apiKey: '',
                model: 'gpt-4'
            });
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            cmdGenie.ShowProvider('test-provider');

            expect(consoleSpy).toHaveBeenCalledWith('  API Key: ❌ Not set');

            consoleSpy.mockRestore();
        });
    });

    describe('GenerateCommand additional scenarios', () => {
        let consoleLogSpy: jest.SpyInstance;
        let consoleErrorSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        });

        afterEach(() => {
            consoleLogSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        it('should handle case when active provider is set but not found in registry', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(true);
            mockConfigManager.GetActiveProviderEntry.mockReturnValue(undefined);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error generating command:', 'Active provider not found in registry');
        });

        it('should handle case when providers exist but none active', async () => {
            mockConfigManager.HasActiveProvider.mockReturnValue(false);
            (mockConfigManager.RegistryManager.ListProviders as jest.Mock).mockReturnValue(['provider1']);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ No active provider selected. Please choose one:');
            expect(consoleLogSpy).toHaveBeenCalledWith('Available providers:', 'provider1');
            expect(consoleLogSpy).toHaveBeenCalledWith('Set active: cmdgenie --update-llm <provider-name>');
        });
    });
});