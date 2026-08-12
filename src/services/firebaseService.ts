import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY ?? "").trim(),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "").trim(),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "").trim(),
  databaseURL: String(import.meta.env.VITE_FIREBASE_DATABASE_URL ?? "").trim(),
  storageBucket: String(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  ).trim(),
  messagingSenderId: String(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  ).trim(),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID ?? "").trim(),
};

function validateConfig(config: Record<string, string>) {
  const missingKeys = Object.entries(config)
    .filter(([, value]) => value === "")
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn(
      `Firebase environment variables appear missing or empty: ${missingKeys.join(", ")}.`,
    );
  }
}

validateConfig(firebaseConfig);

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
