import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  text: string;
  sentiment: number | null;
  createdAt: Timestamp;
}

export const SENTIMENTS: { value: number; emoji: string; label: string }[] = [
  { value: 5, emoji: '🔥', label: 'Muy interesado' },
  { value: 4, emoji: '😊', label: 'Positivo' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 2, emoji: '😕', label: 'Dudoso' },
  { value: 1, emoji: '😞', label: 'Negativo' },
  { value: 0, emoji: '💀', label: 'Ghosted/Muerto' },
];

export function sentimentEmoji(value: number): string {
  const match = SENTIMENTS.find(s => s.value === Math.round(value));
  return match?.emoji ?? '';
}
