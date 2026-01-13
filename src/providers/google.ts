import { Provider } from './base';
import { GOOGLE_URL, GOOGLE_MODEL, GetOS, GoogleResponse } from '../types';

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
                        text: `You are a command line expert. Generate only the exact command(s) needed for: "${prompt}".
Respond with ONLY the command(s), no explanations.
If multiple commands needed, separate with &&.
Current OS: ${GetOS()}`
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
