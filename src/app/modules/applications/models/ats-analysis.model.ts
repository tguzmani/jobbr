export interface QuickWin {
  section: string;
  original: string;
  suggested: string;
  impact: 'HIGH' | 'MEDIUM';
}

export interface ATSDecision {
  action: 'APPLY_NOW' | 'APPLY_AFTER_EDITS' | 'SKIP';
  reason: string;
  quick_wins: QuickWin[];
  time_estimate: string | null;
}

export interface ATSAnalysisResult {
  ats_score: number;
  decision: ATSDecision;
  hard_requirements: { found: string[]; missing: string[] };
  keywords: { present: string[]; missing: string[] };
  strengths: string[];
  gaps: string[];
  bestCvId: string;
  bestCvName: string;
  similarity_pct: number;
  analyzedAt: Date;
}
