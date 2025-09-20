import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Issue, Status, Priority, generateIssues, detectAndMergeDuplicates } from "@/lib/nivaran";

interface DataContextValue {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  assign: (id: string, staffName: string) => void;
  setStatus: (id: string, status: Status) => void;
  regenerate: (count: number) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);
const KEY = "niva:issues:v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);

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
    const seed = detectAndMergeDuplicates(generateIssues(6000));
    setIssues(seed);
    localStorage.setItem(KEY, JSON.stringify(seed));
  }, []);

  const write = (next: Issue[]) => {
    setIssues(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

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

  const value = useMemo<DataContextValue>(() => ({ issues, setIssues, assign, setStatus, regenerate }), [issues]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
