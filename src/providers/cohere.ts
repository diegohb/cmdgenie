import { Provider } from './base';
import { COHERE_URL, COHERE_MODEL, COHERE_MAX_TOKENS, TEMPERATURE, GetOS, CohereResponse } from '../types';

export class CohereProvider implements Provider {
    public readonly Name: string = 'cohere';

    public async Execute(prompt: string, apiKey: string, model: string): Promise<string> {
        const response = await fetch(COHERE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || COHERE_MODEL,
                prompt: `You are a command line expert. Generate only the exact command(s) needed for: "${prompt}".
Respond with ONLY the command(s), no explanations.
If multiple commands needed, separate with &&.
Current OS: ${GetOS()}

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
