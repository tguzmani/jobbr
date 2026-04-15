"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbeddingFn = void 0;
const https_1 = require("firebase-functions/v2/https");
const openrouter_client_1 = require("../common/openrouter/openrouter.client");
exports.generateEmbeddingFn = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Must be signed in.");
    }
    const { text } = request.data;
    if (!text || typeof text !== "string") {
        throw new https_1.HttpsError("invalid-argument", "text is required and must be a string.");
    }
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new https_1.HttpsError("failed-precondition", "OPENROUTER_API_KEY is not configured.");
    }
    try {
        const embedding = await (0, openrouter_client_1.generateEmbedding)(text, apiKey);
        return { embedding };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        throw new https_1.HttpsError("internal", `Embedding generation failed: ${message}`);
    }
});
//# sourceMappingURL=generate-embedding.function.js.map