import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

/**
 * Recalculates sentimentAvg on the parent application document
 * whenever a comment is created, updated, or deleted.
 *
 * Triggered by writes to:
 *   users/{userId}/applications/{applicationId}/comments/{commentId}
 */
export const recalculateSentimentAvg = onDocumentWritten(
  "users/{userId}/applications/{applicationId}/comments/{commentId}",
  async (event) => {
    const { userId, applicationId } = event.params;
    const db = getFirestore();

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
  }
);
