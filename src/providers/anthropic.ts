import { Provider } from './base';
import {
    ANTHROPIC_URL,
    ANTHROPIC_MODEL,
    SYSTEM_PROMPT,
    MAX_TOKENS,
    GetOS,
    GetShell,
    AnthropicResponse
} from '../types';

export class AnthropicProvider implements Provider {
    public readonly Name: string = 'anthropic';

    public async Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string> {
        const url = endpointUrl || ANTHROPIC_URL;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model || ANTHROPIC_MODEL,
                max_tokens: MAX_TOKENS,
                messages: [
                    {
                        role: 'user',
                        content: `${SYSTEM_PROMPT.replace('{os}', GetOS()).replace('{shell}', GetShell()).replace('for the user\'s request', `for: "${prompt}"`)}`
                    }
                ]
            })
        });

        const data = await response.json() as AnthropicResponse;
        if (!response.ok) {
            throw new Error(data.error?.message || 'Anthropic API error');
        }

        return data.content[0].text.trim();
    }
}
