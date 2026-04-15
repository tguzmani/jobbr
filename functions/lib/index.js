"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMatch = exports.generateEmbedding = exports.recalculateSentimentAvg = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const generate_embedding_function_1 = require("./embeddings/generate-embedding.function");
const analyze_match_function_1 = require("./analysis/analyze-match.function");
(0, app_1.initializeApp)();
/**
 * Recalculates sentimentAvg on the parent application document
 * whenever a comment is created, updated, or deleted.
 *
 * Triggered by writes to:
 *   users/{userId}/applications/{applicationId}/comments/{commentId}
 */
exports.recalculateSentimentAvg = (0, firestore_1.onDocumentWritten)("users/{userId}/applications/{applicationId}/comments/{commentId}", async (event) => {
    const { userId, applicationId } = event.params;
    const db = (0, firestore_2.getFirestore)();
    const commentsSnap = await db
        .collection(`users/${userId}/applications/${applicationId}/comments`)
        .get();
    let sum = 0;
    let count = 0;
    for (const doc of commentsSnap.docs) {
        const sentiment = doc.data()["sentiment"];
        if (typeof sentiment === "number") {
            sum += sentiment;
            count++;
        }
    }
    const sentimentAvg = count > 0 ? sum / count : null;
    await db
        .doc(`users/${userId}/applications/${applicationId}`)
        .update({ sentimentAvg });
});
exports.generateEmbedding = generate_embedding_function_1.generateEmbeddingFn;
exports.analyzeMatch = analyze_match_function_1.analyzeMatchFn;
//# sourceMappingURL=index.js.map