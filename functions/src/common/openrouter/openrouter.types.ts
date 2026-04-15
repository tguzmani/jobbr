export interface OpenRouterEmbeddingRequest {
  model: string;
  input: string;
}

export interface OpenRouterEmbeddingResponse {
  data: { embedding: number[] }[];
}

export interface OpenRouterChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterChatRequest {
  model: string;
  messages: OpenRouterChatMessage[];
  temperature?: number;
}

export interface OpenRouterChatResponse {
  choices: { message: { content: string } }[];
}
