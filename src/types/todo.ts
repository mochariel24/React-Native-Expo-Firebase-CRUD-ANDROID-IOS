import type { Timestamp } from 'firebase/firestore';

export type Todo = {
  id: string;
  heading: string;
  createdAt: Timestamp | null;
};
