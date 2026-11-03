import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../../config/firebase';
import { getFirebaseErrorMessage } from '../services/todos';
import type { Todo } from '../types/todo';

const FIREBASE_SETUP_MESSAGE =
  'Firebase belum disiapkan. Salin .env.example menjadi .env dan isi konfigurasi dari Firebase Console.';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : FIREBASE_SETUP_MESSAGE,
  );

  useEffect(() => {
    if (!firestore) {
      return undefined;
    }

    const todosQuery = query(collection(firestore, 'todos'), orderBy('createdAt', 'desc'));

    return onSnapshot(
      todosQuery,
      (snapshot) => {
        const nextTodos = snapshot.docs
          .map((record) => {
            const data = record.data();
            const heading = typeof data.heading === 'string' ? data.heading.trim() : '';

            return {
              id: record.id,
              heading,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
            };
          })
          .filter((todo) => todo.heading.length > 0);

        setTodos(nextTodos);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setLoading(false);
        setError(getFirebaseErrorMessage(snapshotError));
      },
    );
  }, []);

  return { todos, loading, error };
}
