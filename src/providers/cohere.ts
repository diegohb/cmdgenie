import { Provider } from './base';
import { COHERE_URL, COHERE_MODEL, SYSTEM_PROMPT, COHERE_MAX_TOKENS, TEMPERATURE, GetOS, GetShell, CohereResponse } from '../types';

export class CohereProvider implements Provider {
    public readonly Name: string = 'cohere';

    public async Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string> {
        const url = endpointUrl || COHERE_URL;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || COHERE_MODEL,
                prompt: `${SYSTEM_PROMPT.replace('{os}', GetOS()).replace('{shell}', GetShell()).replace('for the user\'s request', `for: "${prompt}"`)}

Command:`,
                max_tokens: COHERE_MAX_TOKENS,
                temperature: TEMPERATURE
            })
        });

        const data = await response.json() as CohereResponse;
        if (!response.ok) {
            throw new Error(data.message || 'Cohere API error');
        }

        return data.generations[0].text.trim();
    }
}
