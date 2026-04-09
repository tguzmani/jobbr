import { Timestamp } from 'firebase/firestore';

export type TaskType = 'interview' | 'technical-test' | 'follow-up' | 'other';
export type TaskStatus = 'to-do' | 'in-progress' | 'review' | 'accepted' | 'failed';

export const TASK_TYPES: TaskType[] = ['interview', 'technical-test', 'follow-up', 'other'];
export const TASK_STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'review', 'accepted', 'failed'];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  'interview': 'Interview',
  'technical-test': 'Technical Test',
  'follow-up': 'Follow-up',
  'other': 'Other'
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  'to-do': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'accepted': 'Accepted',
  'failed': 'Failed'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  'to-do': '#A8A8A8',
  'in-progress': '#E8A838',
  'review': '#0A66C2',
  'accepted': '#5CB85C',
  'failed': '#CC1016'
};

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  'interview': '#17A2B8',
  'technical-test': '#E8A838',
  'follow-up': '#0A66C2',
  'other': '#A8A8A8'
};

export interface Task {
  id: string;
  applicationId?: string;
  name: string;
  description?: string;
  link?: string;
  type: TaskType;
  status: TaskStatus;
  dueDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  commentCount?: number;
}
