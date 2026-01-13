import { OllamaProvider } from '../../src/providers/ollama';
import { OllamaResponse } from '../../src/types';

// Mock fetch globally
global.fetch = jest.fn();

const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('OllamaProvider', () => {
    let provider: OllamaProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new OllamaProvider();
    });

    describe('Name property', () => {
        it('should have correct name', () => {
            expect(provider.Name).toBe('ollama');
        });
    });

    describe('Execute method', () => {
        const mockPrompt = 'list files in current directory';
        const mockModel = 'llama3.1';

        it('should make correct API call with default model', async () => {
            const mockResponse: OllamaResponse = {
                response: 'ls -la',
                done: true
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            const result = await provider.Execute(mockPrompt, '', '');

            expect(mockedFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: expect.stringContaining(mockPrompt)
            });

            expect(result).toBe('ls -la');
        });

        it('should make correct API call with custom model', async () => {
            const mockResponse: OllamaResponse = {
                response: 'dir',
                done: true
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            const result = await provider.Execute(mockPrompt, '', mockModel);

            expect(mockedFetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: expect.stringContaining(`"model":"${mockModel}"`)
                })
            );

            expect(result).toBe('dir');
        });

        it('should include system message with OS context', async () => {
            const mockResponse: OllamaResponse = {
                response: 'ls',
                done: true
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            await provider.Execute(mockPrompt, '', mockModel);

            const callArgs = mockedFetch.mock.calls[0][1] as any;
            const body = JSON.parse(callArgs.body as string);

            expect(body.prompt).toContain('You are a command line expert');
            expect(body.prompt).toContain('Current OS:');
            expect(body.prompt).toContain(mockPrompt);
            expect(body.stream).toBe(false);
        });

        it('should handle API errors', async () => {
            const mockErrorResponse: OllamaResponse = {
                response: '',
                done: true,
                error: 'Model not found'
            };

            mockedFetch.mockResolvedValueOnce({
                ok: false,
                json: jest.fn().mockResolvedValue(mockErrorResponse)
            } as any);

            await expect(provider.Execute(mockPrompt, '', mockModel))
                .rejects.toThrow('Model not found');
        });

        it('should handle network errors', async () => {
            mockedFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(provider.Execute(mockPrompt, '', mockModel))
                .rejects.toThrow('Network error');
        });

        it('should trim response', async () => {
            const mockResponse: OllamaResponse = {
                response: '  ls -la  \n\n',
                done: true
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            const result = await provider.Execute(mockPrompt, '', mockModel);

            expect(result).toBe('ls -la');
        });

        it('should use custom endpoint URL', async () => {
            const customUrl = 'http://custom:11434/api/generate';
            const mockResponse: OllamaResponse = {
                response: 'pwd',
                done: true
            };

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse)
            } as any);

            await provider.Execute(mockPrompt, '', mockModel, customUrl);

            expect(mockedFetch).toHaveBeenCalledWith(customUrl, expect.any(Object));
        });
    });
});