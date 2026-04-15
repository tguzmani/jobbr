import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, Observable, map } from 'rxjs';
import { ATSAnalysisResult } from '../../modules/applications/models/ats-analysis.model';

@Injectable({ providedIn: 'root' })
export class OpenRouterService {
  private functions = inject(Functions);

  generateEmbedding(text: string): Observable<number[]> {
    const callable = httpsCallable<{ text: string }, { embedding: number[] }>(
      this.functions,
      'generateEmbedding'
    );
    return from(callable({ text })).pipe(map(res => res.data.embedding));
  }

  analyzeMatch(cv: string, jd: string, similarityPct: number): Observable<ATSAnalysisResult> {
    const callable = httpsCallable<
      { cv: string; jd: string; similarity_pct: number },
      ATSAnalysisResult
    >(this.functions, 'analyzeMatch');
    return from(callable({ cv, jd, similarity_pct: similarityPct })).pipe(
      map(res => res.data)
    );
  }
}
