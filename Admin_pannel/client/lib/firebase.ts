import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, doc, getDoc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";
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
  if (!db && getApp()) {
    db = databaseId ? getFirestore(getApp(), databaseId) : getFirestore(getApp());
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

// Realtime subscription to 'complaints' collection. Maps Firestore docs to local Issue shape-lite
export type Complaint = {
  complaint_id?: string;
  user_id?: string;
  title?: string;
  description?: string;
  media_url?: string | null;
  category?: string;
  location?: { lat?: number; lng?: number } | null;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
};

export type IssueLite = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  priority: 1 | 2 | 3;
  status: string;
  reporter: { id: string; name: string };
  duplicateOf: string | null;
  groupId: string;
};

function mapCategory(c?: string): string {
  const v = (c || "").toLowerCase();
  if (v.includes("pothole")) return "Pothole";
  if (v.includes("garbage")) return "Garbage";
  if (v.includes("streetlight")) return "Streetlight";
  if (v.includes("water")) return "Water";
  return "Garbage";
}

function toIso(x: any): string {
  if (!x) return new Date().toISOString();
  const d = x instanceof Date ? x : typeof x === "number" ? new Date(x) : new Date(String(x));
  return d.toISOString();
}

export function subscribeComplaints(onChange: (issues: IssueLite[]) => void) {
  const dbInstance = getDb();
  if (!dbInstance) return () => {};
  const q = query(collection(dbInstance, "complaints"), orderBy("created_at", "desc"));
  const unsub = onSnapshot(q as any, (snap: any) => {
    const list: IssueLite[] = [];
    snap.forEach((doc: any) => {
      const d = doc.data() as Complaint;
      const id = (d.complaint_id as string) || doc.id;
      const category = mapCategory(d.category);
      const lat = Number(d.location?.lat ?? 0);
      const lng = Number(d.location?.lng ?? 0);
      list.push({
        id,
        title: d.title || "Untitled",
        description: d.description || "",
        category,
        imageUrl: d.media_url || null,
        latitude: isFinite(lat) ? lat : 0,
        longitude: isFinite(lng) ? lng : 0,
        address: "",
        createdAt: toIso(d.created_at),
        updatedAt: toIso(d.updated_at || d.created_at),
        upvotes: 0,
        priority: 2,
        status: "Pending",
        reporter: { id: d.user_id || "unknown", name: "Citizen" },
        duplicateOf: null,
        groupId: "",
      });
    });
    onChange(list);
  });
  return unsub;
}
