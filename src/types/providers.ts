interface OpenAIChoice {
    message: {
        content: string;
    };
}

export interface OpenAIResponse {
    choices: OpenAIChoice[];
    error?: {
        message: string;
    };
}

interface AnthropicContent {
    text: string;
}

export interface AnthropicResponse {
    content: AnthropicContent[];
    error?: {
        message: string;
    };
}

interface GooglePart {
    text: string;
}

interface GoogleContent {
    parts: GooglePart[];
}

interface GoogleCandidate {
    content: GoogleContent;
}

export interface GoogleResponse {
    candidates: GoogleCandidate[];
    error?: {
        message: string;
    };
}

interface CohereGeneration {
    text: string;
}

export interface CohereResponse {
    generations: CohereGeneration[];
    message?: string;
}
