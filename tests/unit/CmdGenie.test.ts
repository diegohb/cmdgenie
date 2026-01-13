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
        mockConfigManager = {
            Config: {
                activeProvider: 'myopenai'
            },
            ActiveProvider: 'myopenai',
            UpdateActiveProvider: jest.fn(),
            HasActiveProvider: jest.fn(),
            GetActiveProviderEntry: jest.fn(),
            RegistryManager: {
                AddProvider: jest.fn(),
                RemoveProvider: jest.fn(),
                GetProvider: jest.fn(),
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

        it.skip('should clean markdown from command response', async () => {
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

            expect(mockProvider.Execute).toHaveBeenCalledWith('list files', 'test-key', 'gpt-3.5-turbo');
            // The command should be cleaned of markdown
            expect(consoleLogSpy).toHaveBeenCalledWith('\n💡 Generated command: ls -la');
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
});