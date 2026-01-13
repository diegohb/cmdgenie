import { Provider } from './base';
import {
    OLLAMA_URL,
    OLLAMA_MODEL,
    GetOS,
    OllamaResponse
} from '../types';

export class OllamaProvider implements Provider {
    public readonly Name: string = 'ollama';

    public async Execute(prompt: string, _apiKey: string, model: string, endpointUrl?: string): Promise<string> {
        const url = endpointUrl || OLLAMA_URL;
        const fullPrompt = `You are a command line expert. Generate only the exact command(s) needed for the user's request.
Respond with ONLY the command(s), no explanations or formatting.
If multiple commands are needed, separate them with &&.
Detect the operating system context and provide appropriate commands.
Current OS: ${GetOS()}

${prompt}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || OLLAMA_MODEL,
                prompt: fullPrompt,
                stream: false
            })
        });

        const data = await response.json() as OllamaResponse;
        if (!response.ok) {
            throw new Error(data.error || 'Ollama API error');
        }

        return data.response.trim();
    }
}