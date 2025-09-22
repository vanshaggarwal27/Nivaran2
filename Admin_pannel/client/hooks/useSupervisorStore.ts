import { useCallback, useEffect, useMemo, useState } from "react";

export type SupervisorIssueState = {
  acknowledgedAt?: string | null;
  images?: string[]; // data URLs
};

type Store = Record<string, SupervisorIssueState>; // key: issueId

const KEY = "niva:sup:store:v1";

export function useSupervisorStore() {
  const [store, setStore] = useState<Store>({});

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Store;
        setStore(parsed);
      } catch {
        localStorage.removeItem(KEY);
      }
    }
  }, []);

  const write = useCallback((next: Store) => {
    setStore(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const acknowledge = useCallback((issueId: string) => {
    const next: Store = { ...store, [issueId]: { ...(store[issueId] || {}), acknowledgedAt: new Date().toISOString() } };
    write(next);
  }, [store, write]);

  const addImage = useCallback((issueId: string, dataUrl: string) => {
    const prev = store[issueId] || {};
    const imgs = [...(prev.images || []), dataUrl];
    const next: Store = { ...store, [issueId]: { ...prev, images: imgs } };
    write(next);
  }, [store, write]);

  const get = useCallback((issueId: string): SupervisorIssueState => store[issueId] || {}, [store]);

  return useMemo(() => ({ store, acknowledge, addImage, get }), [store, acknowledge, addImage, get]);
}
