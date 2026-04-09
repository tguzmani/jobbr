import { Timestamp } from 'firebase/firestore';

export interface TaskComment {
  id: string;
  text: string;
  createdAt: Timestamp;
}
