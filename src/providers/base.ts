export interface Provider {
    Name: string;
    Execute(prompt: string, apiKey: string, model: string, endpointUrl?: string): Promise<string>;
}

export interface ProviderConstructor {
    new (): Provider;
}
