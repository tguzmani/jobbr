import { onCall, HttpsError } from "firebase-functions/v2/https";
import { generateEmbedding } from "../common/openrouter/openrouter.client";

export const generateEmbeddingFn = onCall<{ text: string }>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  const { text } = request.data;
  if (!text || typeof text !== "string") {
    throw new HttpsError("invalid-argument", "text is required and must be a string.");
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new HttpsError("failed-precondition", "OPENROUTER_API_KEY is not configured.");
  }

  try {
    const embedding = await generateEmbedding(text, apiKey);
    return { embedding };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new HttpsError("internal", `Embedding generation failed: ${message}`);
  }
});
