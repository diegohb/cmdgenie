import { Provider } from './base';
import {
    MAX_TOKENS,
    TEMPERATURE,
    GetOS,
    OpenAIResponse
} from '../types';

export class CustomProvider implements Provider {
    public readonly Name: string = 'custom';

    public async Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string> {
        if (!endpointUrl) {
            throw new Error('Custom provider requires an endpoint URL');
        }

        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: `You are a command line expert. Generate only the exact command(s) needed for the user's request. 
Respond with ONLY the command(s), no explanations or formatting. 
If multiple commands are needed, separate them with &&.
Detect the operating system context and provide appropriate commands.
Current OS: ${GetOS()}`
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: MAX_TOKENS,
                temperature: TEMPERATURE
            })
        });

        const data = await response.json() as OpenAIResponse;
        if (!response.ok) {
            throw new Error(data.error?.message || 'Custom API error');
        }

        return data.choices[0].message.content.trim();
    }
}