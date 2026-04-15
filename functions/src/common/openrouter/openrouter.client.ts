import {
  OpenRouterEmbeddingRequest,
  OpenRouterEmbeddingResponse,
  OpenRouterChatRequest,
  OpenRouterChatResponse,
} from "./openrouter.types";

const BASE_URL = "https://openrouter.ai/api/v1";

async function post<TReq, TRes>(path: string, body: TReq, apiKey: string): Promise<TRes> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${path} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<TRes>;
}

export async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const body: OpenRouterEmbeddingRequest = {
    model: "openai/text-embedding-3-small",
    input: text,
  };

  const data = await post<OpenRouterEmbeddingRequest, OpenRouterEmbeddingResponse>(
    "/embeddings",
    body,
    apiKey
  );

  return data.data[0].embedding;
}

export async function chatCompletion(prompt: string, apiKey: string): Promise<string> {
  const body: OpenRouterChatRequest = {
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  };

  const data = await post<OpenRouterChatRequest, OpenRouterChatResponse>(
    "/chat/completions",
    body,
    apiKey
  );

  return data.choices[0].message.content;
}
