import { Provider } from './base';
import {
    OPENAI_URL,
    OPENAI_MODEL,
    SYSTEM_PROMPT,
    MAX_TOKENS,
    TEMPERATURE,
    GetOS,
    GetShell,
    OpenAIResponse
} from '../types';

export class OpenAIProvider implements Provider {
    public readonly Name: string = 'openai';

    public async Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string> {
        const url = endpointUrl || OPENAI_URL;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT.replace('{os}', GetOS()).replace('{shell}', GetShell())
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: MAX_TOKENS,
                temperature: TEMPERATURE
            })
        });

        const data = await response.json() as OpenAIResponse;
        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API error');
        }

        return data.choices[0].message.content.trim();
    }
}
