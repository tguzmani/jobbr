import { Timestamp } from 'firebase/firestore';

export interface CV {
  id: string;
  name: string;
  filename: string;
  content: string;
  embedding: number[];
  createdAt: Timestamp;
}
