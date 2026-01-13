import { AnthropicProvider } from '../../src/providers/anthropic';
import { GoogleProvider } from '../../src/providers/google';
import { CohereProvider } from '../../src/providers/cohere';
import { AnthropicResponse, GoogleResponse, CohereResponse } from '../../src/types';

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