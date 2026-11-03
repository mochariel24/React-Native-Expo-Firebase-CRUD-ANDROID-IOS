import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { requireFirestore } from '../../config/firebase';

export async function createTodo(heading: string): Promise<void> {
  const db = requireFirestore();
  await addDoc(collection(db, 'todos'), {
    heading,
    createdAt: serverTimestamp(),
  });
}

export async function updateTodo(id: string, heading: string): Promise<void> {
  const db = requireFirestore();
  await updateDoc(doc(db, 'todos', id), {
    heading,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTodo(id: string): Promise<void> {
  const db = requireFirestore();
  await deleteDoc(doc(db, 'todos', id));
}

export function getFirebaseErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';

  if (code.includes('permission-denied')) {
    return 'Firestore menolak akses. Periksa Firestore Rules pada proyek Firebase Anda.';
  }

  if (code.includes('unavailable') || code.includes('network')) {
    return 'Tidak dapat terhubung ke Firebase. Periksa koneksi internet lalu coba lagi.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Operasi belum berhasil. Coba lagi beberapa saat.';
}
