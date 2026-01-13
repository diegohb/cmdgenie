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
        mockConfigManager = {
            Config: {
                provider: 'openai',
                apiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            },
            Provider: 'openai',
            Model: 'gpt-3.5-turbo',
            ApiKey: 'test-key',
            UpdateLLM: jest.fn(),
            HasApiKey: jest.fn(),
            GetProviderConfig: jest.fn()
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

    describe('UpdateLLM', () => {
        it('should call ConfigManager UpdateLLM with success', async () => {
            mockConfigManager.UpdateLLM.mockReturnValue(true);

            await cmdGenie.UpdateLLM('openai', 'new-key', 'gpt-4');

            expect(mockConfigManager.UpdateLLM).toHaveBeenCalledWith('openai', 'new-key', 'gpt-4');
        });

        it('should handle UpdateLLM failure', async () => {
            mockConfigManager.UpdateLLM.mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await cmdGenie.UpdateLLM('invalid', 'key');

            expect(consoleSpy).toHaveBeenCalledWith('Unsupported provider: invalid');
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

        it('should error when no API key is configured', async () => {
            mockConfigManager.HasApiKey.mockReturnValue(false);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ No API key configured. Please run: cmdgenie --update-llm <provider> <api-key>');
            expect(consoleLogSpy).not.toHaveBeenCalledWith('🤖 Generating command...');
        });

        it('should generate command successfully', async () => {
            mockConfigManager.HasApiKey.mockReturnValue(true);
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
            mockConfigManager.HasApiKey.mockReturnValue(true);
            mockProviderRegistry.GetProvider.mockReturnValue(null);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error generating command:', 'Unsupported provider: openai');
        });

        it('should handle provider execution errors', async () => {
            mockConfigManager.HasApiKey.mockReturnValue(true);
            const mockProvider = new OpenAIProvider();
            mockProvider.Execute = jest.fn().mockRejectedValue(new Error('API Error'));
            mockProviderRegistry.GetProvider.mockReturnValue(mockProvider);

            await cmdGenie.GenerateCommand('test prompt');

            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error generating command:', 'API Error');
        });

        it.skip('should clean markdown from command response', async () => {
            mockConfigManager.HasApiKey.mockReturnValue(true);
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
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            cmdGenie.ShowHelp();

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🧞 CmdGenie - AI-Powered Command Generator'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Provider: openai'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Model: gpt-3.5-turbo'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('API Key: ✅ Set'));

            consoleSpy.mockRestore();
        });
    });
});