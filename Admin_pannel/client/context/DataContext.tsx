import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Issue, Status, Priority, generateIssues, detectAndMergeDuplicates } from "@/lib/nivaran";
import { upsertIssueLocation, isFirebaseConfigured, subscribeComplaints } from "@/lib/firebase";

interface DataContextValue {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  assign: (id: string, staffName: string) => void;
  setStatus: (id: string, status: Status) => void;
  regenerate: (count: number) => void;
  ensureMockFor: (staffName: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);
const KEY = "niva:issues:v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const mockRef = useRef<Issue[] | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Issue[];
        setIssues(parsed);
        return;
      } catch {
        localStorage.removeItem(KEY);
      }
    }
    const seed = detectAndMergeDuplicates(generateIssues(5));
    mockRef.current = seed;
    setIssues(seed);
    localStorage.setItem(KEY, JSON.stringify(seed));
  }, []);

  const write = (next: Issue[]) => {
    setIssues(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  // Firestore realtime subscription: merge live complaints with 5 local mocks
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeComplaints((live) => {
      const base = mockRef.current || [];
      const merged = [...base, ...live.map(toIssue)];
      setIssues(merged);
      localStorage.setItem(KEY, JSON.stringify(merged));
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  function toIssue(x: any): Issue {
    return {
      id: x.id,
      title: x.title,
      description: x.description,
      category: x.category as any,
      imageUrl: x.imageUrl,
      latitude: x.latitude,
      longitude: x.longitude,
      address: x.address,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
      upvotes: x.upvotes,
      priority: x.priority,
      status: x.status as any,
      assignment: { staffId: null, staffName: null, assignedAt: null },
      reporter: x.reporter,
      duplicateOf: null,
      groupId: "",
    };
  }

  const assign: DataContextValue["assign"] = (id, staffName) => {
    write(
      issues.map((i) =>
        i.id === id
          ? { ...i, assignment: { staffId: staffName.toLowerCase().replace(/\s+/g, "-"), staffName, assignedAt: new Date().toISOString() }, status: i.status === "Pending" ? "In Progress" : i.status }
          : i,
      ),
    );
  };

  const setStatus: DataContextValue["setStatus"] = (id, status) => {
    write(issues.map((i) => (i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i)));
  };

  const regenerate: DataContextValue["regenerate"] = (count) => {
    const seed = detectAndMergeDuplicates(generateIssues(count));
    write(seed);
  };

  const ensureMockFor: DataContextValue["ensureMockFor"] = (staffName) => {
    if (!staffName) return;
    const exists = issues.some((i) => i.assignment.staffName === staffName);
    if (exists) return;
    const now = new Date();
    const id = crypto.randomUUID();
    const norm = staffName.toLowerCase().replace(/\s+/g, "-");
    const mock: Issue = {
      id,
      title: "Mock: Streetlight not working",
      description: "Demonstration issue assigned to you. Replace with real data when connected.",
      category: "Streetlight",
      imageUrl: "/placeholder.svg",
      latitude: 28.6139,
      longitude: 77.209,
      address: "Ward 1, Zone 1",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      upvotes: 0,
      priority: 2,
      status: "Pending",
      assignment: { staffId: norm, staffName, assignedAt: now.toISOString() },
      reporter: { id: "demo", name: "Citizen Demo" },
      duplicateOf: null,
      groupId: "",
    };
    write([mock, ...issues]);
    if (isFirebaseConfigured()) {
      upsertIssueLocation(id, mock.latitude, mock.longitude, mock.address);
    }
  };

  const value = useMemo<DataContextValue>(() => ({ issues, setIssues, assign, setStatus, regenerate, ensureMockFor }), [issues]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
