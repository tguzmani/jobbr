import { onCall, HttpsError } from "firebase-functions/v2/https";
import { chatCompletion } from "../common/openrouter/openrouter.client";

interface AnalyzeMatchInput {
  cv: string;
  jd: string;
  similarity_pct: number;
}

export const analyzeMatchFn = onCall<AnalyzeMatchInput>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  const { cv, jd, similarity_pct } = request.data;
  if (!cv || !jd || typeof similarity_pct !== "number") {
    throw new HttpsError("invalid-argument", "cv, jd, and similarity_pct are required.");
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new HttpsError("failed-precondition", "OPENROUTER_API_KEY is not configured.");
  }

  const prompt = `You are an ATS expert. Analyze this CV against the Job Description.

SEMANTIC SIMILARITY (from embeddings): ${similarity_pct}%

JOB DESCRIPTION:
${jd}

CV:
${cv}

Decision rules (apply strictly):
- APPLY_NOW → ats_score >= 70 AND no missing hard requirements
- APPLY_AFTER_EDITS → ats_score 40-69 OR fixable gaps exist. Provide specific quick_wins.
- SKIP → ats_score < 40 OR missing hard requirements that cannot be fixed
  (wrong seniority, completely different stack, US-only legal: W-2, I-9, E-Verify)

Respond ONLY with valid JSON, no markdown, no preamble:
{
  "ats_score": number,
  "decision": {
    "action": "APPLY_NOW" | "APPLY_AFTER_EDITS" | "SKIP",
    "reason": "2-3 sentences explaining why",
    "quick_wins": [
      { "section": string, "original": string, "suggested": string, "impact": "HIGH" | "MEDIUM" }
    ],
    "time_estimate": string | null
  },
  "hard_requirements": { "found": string[], "missing": string[] },
  "keywords": { "present": string[], "missing": string[] },
  "strengths": string[],
  "gaps": string[]
}`;

  try {
    let raw = await chatCompletion(prompt, apiKey);

    // Strip markdown fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const result = JSON.parse(raw);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new HttpsError("internal", `Match analysis failed: ${message}`);
  }
});
