import { Timestamp } from 'firebase/firestore';

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn'
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn'
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#0A66C2',
  screening: '#E8A838',
  interview: '#E8A838',
  offer: '#5CB85C',
  rejected: '#CC1016',
  withdrawn: '#A8A8A8'
};

export type SalaryPeriod = 'yearly' | 'monthly' | 'hourly';

export const SALARY_PERIOD_LABELS: Record<SalaryPeriod, string> = {
  yearly: 'Yearly',
  monthly: 'Monthly',
  hourly: 'Hourly'
};

export const PIPELINE_STATUSES: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview',
  'offer'
];

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: ApplicationStatus;
  appliedAt: Timestamp;
  updatedAt: Timestamp;
  source: string;
  jobUrl?: string;
  notes?: string;
  tags: string[];
  commentCount?: number;
  sentimentAvg?: number | null;
}
