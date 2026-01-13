import { AnthropicProvider } from '../../src/providers/anthropic';
import { GoogleProvider } from '../../src/providers/google';
import { CohereProvider } from '../../src/providers/cohere';
import { OllamaProvider } from '../../src/providers/ollama';
import { CustomProvider } from '../../src/providers/custom';
import { AnthropicResponse, GoogleResponse, CohereResponse, OllamaResponse, OpenAIResponse } from '../../src/types';

// Mock fetch globally
global.fetch = jest.fn();

const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('AnthropicProvider', () => {
    let provider: AnthropicProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new AnthropicProvider();
    });

    it('should have correct name', () => {
        expect(provider.Name).toBe('anthropic');
    });

    it('should make correct API call', async () => {
        const mockResponse: AnthropicResponse = {
            content: [{ text: 'ls -la' }]
        };

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse)
        } as any);

        const result = await provider.Execute('list files', 'api-key', 'claude-3-haiku');

        expect(mockedFetch).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', expect.any(Object));
        expect(result).toBe('ls -la');
    });
});

describe('GoogleProvider', () => {
    let provider: GoogleProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new GoogleProvider();
    });

    it('should have correct name', () => {
        expect(provider.Name).toBe('google');
    });

    it('should make correct API call', async () => {
        const mockResponse: GoogleResponse = {
            candidates: [{
                content: {
                    parts: [{ text: 'dir' }]
                }
            }]
        };

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse)
        } as any);

        const result = await provider.Execute('list files', 'api-key', 'gemini-pro');

        expect(mockedFetch).toHaveBeenCalledWith(
            expect.stringContaining('https://generativelanguage.googleapis.com'),
            expect.any(Object)
        );
        expect(result).toBe('dir');
    });
});

describe('CohereProvider', () => {
    let provider: CohereProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new CohereProvider();
    });

    it('should have correct name', () => {
        expect(provider.Name).toBe('cohere');
    });

    it('should make correct API call', async () => {
        const mockResponse: CohereResponse = {
            generations: [{ text: 'pwd' }]
        };

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse)
        } as any);

        const result = await provider.Execute('current directory', 'api-key', 'command');

        expect(mockedFetch).toHaveBeenCalledWith('https://api.cohere.ai/v1/generate', expect.any(Object));
        expect(result).toBe('pwd');
    });
});

describe('OllamaProvider', () => {
    let provider: OllamaProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new OllamaProvider();
    });

    it('should have correct name', () => {
        expect(provider.Name).toBe('ollama');
    });

    it('should make correct API call', async () => {
        const mockResponse: OllamaResponse = {
            response: 'ls -la',
            done: true
        };

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse)
        } as any);

        const result = await provider.Execute('list files', '', 'llama3.1');

        expect(mockedFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', expect.any(Object));
        expect(result).toBe('ls -la');
    });
});

describe('CustomProvider', () => {
    let provider: CustomProvider;

    beforeEach(() => {
        jest.clearAllMocks();
        provider = new CustomProvider();
    });

    it('should have correct name', () => {
        expect(provider.Name).toBe('custom');
    });

    it('should make correct API call with endpoint URL', async () => {
        const mockResponse: OpenAIResponse = {
            choices: [{
                message: { content: 'ls -la' }
            }]
        };

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse)
        } as any);

        const result = await provider.Execute('list files', 'api-key', 'gpt-3.5-turbo', 'https://custom.api.com/v1/chat/completions');

        expect(mockedFetch).toHaveBeenCalledWith('https://custom.api.com/v1/chat/completions', expect.any(Object));
        expect(result).toBe('ls -la');
    });

    it('should throw error when no endpoint URL provided', async () => {
        await expect(provider.Execute('list files', 'api-key', 'gpt-3.5-turbo')).rejects.toThrow('Custom provider requires an endpoint URL');
    });
});