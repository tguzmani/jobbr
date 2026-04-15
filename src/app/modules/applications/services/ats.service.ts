import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OpenRouterService } from '../../../shared/services/openrouter.service';
import { ApplicationsService } from './applications.service';
import { CvService } from '../../cv/services/cv.service';
import { ATSAnalysisResult } from '../models/ats-analysis.model';
import { CV } from '../../cv/models/cv.model';

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0;
  return dot / magnitude;
}

@Injectable({ providedIn: 'root' })
export class AtsService {
  private openRouter = inject(OpenRouterService);
  private appService = inject(ApplicationsService);
  private cvService = inject(CvService);

  async analyze(applicationId: string, jdText: string): Promise<ATSAnalysisResult> {
    const cvs = this.cvService.cvs();
    if (cvs.length === 0) {
      throw new Error('No CVs uploaded. Please upload a CV in your Profile first.');
    }

    // 1. Generate embedding for the JD
    const jdEmbedding = await firstValueFrom(this.openRouter.generateEmbedding(jdText));

    // 2. Save jdText and jdEmbedding to the application
    await this.appService.update(applicationId, { jdText, jdEmbedding } as any);

    // 3. Compute cosine similarity with each CV
    let bestCv: CV = cvs[0];
    let bestSimilarity = -1;

    for (const cv of cvs) {
      if (!cv.embedding?.length) continue;
      const sim = cosineSimilarity(jdEmbedding, cv.embedding);
      if (sim > bestSimilarity) {
        bestSimilarity = sim;
        bestCv = cv;
      }
    }

    const similarityPct = Math.round(bestSimilarity * 100);

    // 4. Call analyzeMatch with the best CV
    const result = await firstValueFrom(
      this.openRouter.analyzeMatch(bestCv.content, jdText, similarityPct)
    );

    // 5. Attach CV info and save
    const matchResult: ATSAnalysisResult = {
      ...result,
      bestCvId: bestCv.id,
      bestCvName: bestCv.name,
      similarity_pct: similarityPct,
      analyzedAt: new Date()
    };

    await this.appService.update(applicationId, { matchResult } as any);

    return matchResult;
  }
}
