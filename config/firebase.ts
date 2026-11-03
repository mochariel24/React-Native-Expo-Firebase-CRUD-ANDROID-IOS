import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const requiredFirebaseValues = [
  firebaseConfig.apiKey,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredFirebaseValues.every(
  (value) => typeof value === 'string' && value.length > 0 && !value.startsWith('YOUR_'),
);

let firestore: Firestore | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export { firestore };

export function requireFirestore(): Firestore {
  if (!firestore) {
    throw new Error('Firebase belum dikonfigurasi. Isi nilai pada file .env, lalu mulai ulang Expo.');
  }

  return firestore;
}
