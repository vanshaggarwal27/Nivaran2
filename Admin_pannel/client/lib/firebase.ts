import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export function isFirebaseConfigured() {
  return Boolean(cfg.apiKey && cfg.projectId && cfg.storageBucket);
}

let app: any = null;
let auth: any = null;

// Lazy initialization
function getApp() {
  if (!app && isFirebaseConfigured()) {
    app = getApps().length ? getApps()[0]! : initializeApp(cfg);
  }
  return app;
}

function getAuthInstance() {
  if (!auth && getApp()) {
    auth = getAuth(getApp());
  }
  return auth;
}

export { getAuthInstance as auth };

const databaseId = import.meta.env.VITE_FIRESTORE_DB_ID as string | undefined; // REQUIRED for non-default DB
let db: Firestore | null = null;

function getDb() {
  if (!db && getApp() && databaseId) {
    db = getFirestore(getApp(), databaseId);
  }
  return db;
}

export { getDb as db };

function getStorageInstance() {
  return getApp() ? getStorage(getApp()) : null;
}

export { getStorageInstance as storage };

export async function uploadIssueImage(issueId: string, file: File, by?: { id?: string; name?: string }) {
  const storageInstance = getStorageInstance();
  if (!storageInstance) throw new Error("Firebase Storage not configured");
  const path = `issues/${issueId}/${Date.now()}_${file.name}`;
  const r = ref(storageInstance, path);
  const snap = await uploadBytes(r, file, { contentType: file.type });
  const url = await getDownloadURL(snap.ref);
  const dbInstance = getDb();
  if (dbInstance) {
    try {
      await addDoc(collection(dbInstance, "issues", issueId, "attachments"), {
        url,
        name: file.name,
        contentType: file.type,
        uploadedAt: new Date().toISOString(),
        by: { id: by?.id || null, name: by?.name || null },
      });
    } catch {
      // Firestore optional; ignore if rules or DB not ready
    }
  }
  return url;
}

export async function getIssueLocation(issueId: string): Promise<{ latitude: number; longitude: number; address?: string } | null> {
  const dbInstance = getDb();
  if (!dbInstance) return null;
  try {
    const d = await getDoc(doc(dbInstance, "issues", issueId));
    if (!d.exists()) return null;
    const data = d.data() as any;
    if (typeof data?.latitude === "number" && typeof data?.longitude === "number") {
      return { latitude: data.latitude, longitude: data.longitude, address: data.address };
    }
    return null;
  } catch {
    return null;
  }
}

export async function upsertIssueLocation(issueId: string, latitude: number, longitude: number, address?: string) {
  const dbInstance = getDb();
  if (!dbInstance) return false;
  try {
    await setDoc(doc(dbInstance, "issues", issueId), { latitude, longitude, address: address || null, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch {
    return false;
  }
}
