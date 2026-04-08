import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  text: string;
  createdAt: Timestamp;
}
