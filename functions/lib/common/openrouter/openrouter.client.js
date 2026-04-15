"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
exports.chatCompletion = chatCompletion;
const BASE_URL = "https://openrouter.ai/api/v1";
async function post(path, body, apiKey) {
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
    return res.json();
}
async function generateEmbedding(text, apiKey) {
    const body = {
        model: "openai/text-embedding-3-small",
        input: text,
    };
    const data = await post("/embeddings", body, apiKey);
    return data.data[0].embedding;
}
async function chatCompletion(prompt, apiKey) {
    const body = {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
    };
    const data = await post("/chat/completions", body, apiKey);
    return data.choices[0].message.content;
}
//# sourceMappingURL=openrouter.client.js.map