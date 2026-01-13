import { Provider } from './base';
import { GOOGLE_URL, GOOGLE_MODEL, SYSTEM_PROMPT, GetOS, GetShell, GoogleResponse } from '../types';

export class GoogleProvider implements Provider {
    public readonly Name: string = 'google';

    public async Execute(prompt: string, apiKey: string, model: string, _endpointUrl?: string): Promise<string> {
        const response = await fetch(`${GOOGLE_URL}/${model || GOOGLE_MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: SYSTEM_PROMPT.replace('{os}', GetOS()).replace('{shell}', GetShell()).replace('for the user\'s request', `for: "${prompt}"`)
                    }]
                }]
            })
        });

        const data = await response.json() as GoogleResponse;
        if (!response.ok) {
            throw new Error(data.error?.message || 'Google API error');
        }

        return data.candidates[0].content.parts[0].text.trim();
    }
}
