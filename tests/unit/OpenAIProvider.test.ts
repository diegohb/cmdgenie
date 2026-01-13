import { OpenAIProvider } from '../../src/providers/openai';
import { OpenAIResponse } from '../../src/types';

// Mock fetch globally
global.fetch = jest.fn();

const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('OpenAIProvider', () => {
    let provider: OpenAIProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new OpenAIProvider();
    });

    describe('Name property', () => {
        it('should have correct name', () => {
            expect(provider.Name).toBe('openai');
        });
    });

    describe('Execute method', () => {
        const mockApiKey = 'test-api-key';
        const mockPrompt = 'list files in current directory';
        const mockModel = 'gpt-3.5-turbo';

        it('should make correct API call with default model', async () => {
            const mockResponse: OpenAIResponse = {
                choices: [{
                    message: {
                        content: 'ls -la'
                    }
                }]
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            const result = await provider.Execute(mockPrompt, mockApiKey, '');

            expect(mockedFetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mockApiKey}`
                },
                body: expect.stringContaining(mockPrompt)
            });

            expect(result).toBe('ls -la');
        });

        it('should make correct API call with custom model', async () => {
            const mockResponse: OpenAIResponse = {
                choices: [{
                    message: {
                        content: 'dir'
                    }
                }]
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            const result = await provider.Execute(mockPrompt, mockApiKey, mockModel);

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: expect.stringContaining(`"model":"${mockModel}"`)
                })
            );

            expect(result).toBe('dir');
        });

        it('should include system message with OS and shell context', async () => {
            const mockResponse: OpenAIResponse = {
                choices: [{
                    message: {
                        content: 'ls'
                    }
                }]
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            await provider.Execute(mockPrompt, mockApiKey, mockModel);

            const callArgs = mockedFetch.mock.calls[0][1] as any;
            const body = JSON.parse(callArgs.body as string);

            expect(body.messages).toHaveLength(2);
            expect(body.messages[0].role).toBe('system');
            expect(body.messages[0].content).toContain('You are a command line expert');
            expect(body.messages[0].content).toContain('Do not include any reasoning, thinking, or internal monologue content');
            expect(body.messages[0].content).toContain('Current OS:');
            expect(body.messages[0].content).toContain('Current Shell:');
            expect(body.messages[1].role).toBe('user');
            expect(body.messages[1].content).toBe(mockPrompt);
        });

        it('should handle API errors', async () => {
            const mockErrorResponse: OpenAIResponse = {
                choices: [],
                error: {
                    message: 'Invalid API key'
                }
            };

            mockedFetch.mockResolvedValueOnce({
                ok: false,
                json: jest.fn().mockResolvedValue(mockErrorResponse)
            } as any);

            await expect(provider.Execute(mockPrompt, mockApiKey, mockModel))
                .rejects.toThrow('Invalid API key');
        });

        it('should handle network errors', async () => {
            mockedFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(provider.Execute(mockPrompt, mockApiKey, mockModel))
                .rejects.toThrow('Network error');
        });

        it('should trim response content', async () => {
            const mockResponse: OpenAIResponse = {
                choices: [{
                    message: {
                        content: '  ls -la  \n\n'
                    }
                }]
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            const result = await provider.Execute(mockPrompt, mockApiKey, mockModel);

            expect(result).toBe('ls -la');
        });

        it('should use correct API parameters', async () => {
            const mockResponse: OpenAIResponse = {
                choices: [{
                    message: {
                        content: 'pwd'
                    }
                }]
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            await provider.Execute(mockPrompt, mockApiKey, mockModel);

            const callArgs = mockedFetch.mock.calls[0][1] as any;
            const body = JSON.parse(callArgs.body as string);

            expect(body.max_tokens).toBe(150);
            expect(body.temperature).toBe(0.1);
        });
    });
});