import { addDays, subDays } from "date-fns";

export type Category = "Garbage" | "Pothole" | "Streetlight" | "Water" | "Sewage" | "Encroachment";
export type Priority = 1 | 2 | 3; // 1=High, 2=Medium, 3=Low
export type Status = "Pending" | "In Progress" | "Resolved";

export interface Reporter {
  id: string;
  name: string;
}

export interface Assignment {
  staffId: string | null;
  staffName: string | null;
  assignedAt: string | null; // ISO date
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  upvotes: number;
  priority: Priority;
  status: Status;
  assignment: Assignment;
  reporter: Reporter;
  duplicateOf: string | null; // canonical id if merged
  groupId: string; // grouping cluster id
}

export const CATEGORIES: Category[] = [
  "Garbage",
  "Pothole",
  "Streetlight",
  "Water",
  "Sewage",
  "Encroachment",
];

export const STATUS: Status[] = ["Pending", "In Progress", "Resolved"];

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function normalizeText(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function jaccardSimilarity(a: string, b: string): number {
  const sa = new Set(normalizeText(a).split(" "));
  const sb = new Set(normalizeText(b).split(" "));
  const intersection = new Set([...sa].filter((x) => sb.has(x))).size;
  const union = new Set([...sa, ...sb]).size;
  return union ? intersection / union : 0;
}

export function detectAndMergeDuplicates(issues: Issue[], options?: { maxKm?: number; textThreshold?: number; timeWindowHours?: number }): Issue[] {
  const maxKm = options?.maxKm ?? 0.2; // 200 meters
  const textThreshold = options?.textThreshold ?? 0.5;
  const timeWindowHours = options?.timeWindowHours ?? 24;

  const sorted = [...issues].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const groups: { id: string; members: Issue[] }[] = [];
  const bucket = new Map<string, number[]>(); // key => indices of groups
  const bucketKey = (lat: number, lon: number) => `${lat.toFixed(3)}:${lon.toFixed(3)}`; // ~100m grid

  for (const issue of sorted) {
    let placed = false;
    const keys = [
      bucketKey(issue.latitude, issue.longitude),
      bucketKey(issue.latitude + 0.001, issue.longitude),
      bucketKey(issue.latitude - 0.001, issue.longitude),
      bucketKey(issue.latitude, issue.longitude + 0.001),
      bucketKey(issue.latitude, issue.longitude - 0.001),
    ];

    const candidateGroupIdxs = new Set<number>();
    for (const k of keys) {
      const arr = bucket.get(k);
      if (arr) arr.forEach((idx) => candidateGroupIdxs.add(idx));
    }

    for (const idx of candidateGroupIdxs.size ? candidateGroupIdxs : [...groups.keys()]) {
      const g = groups[idx as number];
      if (!g) continue;
      const ref = g.members[0];
      const timeDiffH = Math.abs(new Date(issue.createdAt).getTime() - new Date(ref.createdAt).getTime()) / 3_600_000;
      const near = haversineKm({ lat: issue.latitude, lon: issue.longitude }, { lat: ref.latitude, lon: ref.longitude }) <= maxKm;
      const similar = issue.category === ref.category && jaccardSimilarity(issue.title + " " + issue.description, ref.title + " " + ref.description) >= textThreshold;
      if (near && similar && timeDiffH <= timeWindowHours) {
        g.members.push(issue);
        const k = bucketKey(ref.latitude, ref.longitude);
        const list = bucket.get(k) ?? [];
        if (!list.includes(idx as number)) list.push(idx as number);
        bucket.set(k, list);
        placed = true;
        break;
      }
    }

    if (!placed) {
      const id = crypto.randomUUID();
      const newIdx = groups.push({ id, members: [issue] }) - 1;
      const k = bucketKey(issue.latitude, issue.longitude);
      const list = bucket.get(k) ?? [];
      list.push(newIdx);
      bucket.set(k, list);
    }
  }

  const merged: Issue[] = [];
  for (const g of groups) {
    const canonical = [...g.members].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.upvotes !== b.upvotes) return b.upvotes - a.upvotes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0];

    for (const m of g.members) {
      m.groupId = g.id;
      m.duplicateOf = m.id === canonical.id ? null : canonical.id;
    }

    const totalUpvotes = g.members.reduce((sum, m) => sum + m.upvotes, 0);
    const latestUpdated = g.members.reduce((d, m) => (new Date(m.updatedAt) > new Date(d) ? m.updatedAt : d), canonical.updatedAt);
    merged.push({ ...canonical, upvotes: totalUpvotes, updatedAt: latestUpdated });
  }

  return merged;
}

export function generateIssues(count: number, seed = 42): Issue[] {
  let s = seed;
  const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const baseLat = 28.6139; // Delhi approx
  const baseLon = 77.2090;
  const reporters = Array.from({ length: 200 }, (_, i) => ({ id: `r${i}`, name: `Citizen ${i + 1}` }));
  const titles = {
    Garbage: ["Overflowing garbage bin", "Uncollected waste pile", "Littered street corner"],
    Pothole: ["Large pothole on road", "Broken asphalt patch", "Deep road cavity"],
    Streetlight: ["Streetlight not working", "Flickering light pole", "Dark stretch at night"],
    Water: ["Water leakage from pipe", "Burst pipeline flooding", "No water supply"],
    Sewage: ["Open manhole hazard", "Sewage overflow", "Blocked sewer line"],
    Encroachment: ["Illegal roadside stall", "Footpath encroachment", "Unauthorized parking"]
  } as const;

  const issues: Issue[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const reporter = reporters[Math.floor(rand() * reporters.length)];
    const created = subDays(now, Math.floor(rand() * 60));
    created.setHours(Math.floor(rand() * 24));
    const statusRand = rand();
    const status: Status = statusRand < 0.55 ? "Pending" : statusRand < 0.85 ? "In Progress" : "Resolved";
    const priority: Priority = (1 + Math.floor(rand() * 3)) as Priority;
    const upvotes = Math.floor(rand() * 120);
    const dLat = (rand() - 0.5) * 0.15; // ~15-20km box
    const dLon = (rand() - 0.5) * 0.15;
    const id = crypto.randomUUID();

    const title = titles[category][Math.floor(rand() * titles[category].length)];
    const desc = `${title}. Please resolve at the earliest.`;
    const img = rand() < 0.7 ? "/placeholder.svg" : null;

    const issue: Issue = {
      id,
      title,
      description: desc,
      category,
      imageUrl: img,
      latitude: baseLat + dLat,
      longitude: baseLon + dLon,
      address: `Ward ${1 + Math.floor(rand() * 60)}, Zone ${1 + Math.floor(rand() * 12)}`,
      createdAt: created.toISOString(),
      updatedAt: addDays(created, Math.floor(rand() * 10)).toISOString(),
      upvotes,
      priority,
      status,
      assignment: { staffId: null, staffName: null, assignedAt: null },
      reporter,
      duplicateOf: null,
      groupId: "",
    };
    issues.push(issue);

    // Occasionally generate a near-duplicate
    if (rand() < 0.15) {
      const n = 1 + Math.floor(rand() * 2);
      for (let j = 0; j < n; j++) {
        const jitterLat = issue.latitude + (rand() - 0.5) * 0.0015;
        const jitterLon = issue.longitude + (rand() - 0.5) * 0.0015;
        const dup: Issue = {
          ...issue,
          id: crypto.randomUUID(),
          latitude: jitterLat,
          longitude: jitterLon,
          upvotes: Math.floor(issue.upvotes * (0.5 + rand() * 0.6)),
          createdAt: addDays(new Date(issue.createdAt), Math.floor(rand() * 2)).toISOString(),
          updatedAt: addDays(new Date(issue.createdAt), Math.floor(rand() * 3)).toISOString(),
          assignment: { staffId: null, staffName: null, assignedAt: null },
        };
        issues.push(dup);
      }
    }
  }

  return issues;
}

export type IssueFilter = {
  query?: string;
  category?: Category | "All";
  status?: Status | "All";
  priority?: Priority | "All";
  start?: Date | null;
  end?: Date | null;
  onlyCanonical?: boolean; // hide duplicates
};

export type SortKey = "createdAt" | "priority" | "upvotes" | "status";
export type SortDir = "asc" | "desc";

export function filterIssues(list: Issue[], f: IssueFilter): Issue[] {
  return list.filter((i) => {
    if (f.onlyCanonical && i.duplicateOf) return false;
    if (f.query) {
      const q = f.query.toLowerCase();
      if (!(`${i.title} ${i.description} ${i.address}`.toLowerCase().includes(q))) return false;
    }
    if (f.category && f.category !== "All" && i.category !== f.category) return false;
    if (f.status && f.status !== "All" && i.status !== f.status) return false;
    if (f.priority && f.priority !== "All" && i.priority !== f.priority) return false;
    if (f.start && new Date(i.createdAt) < f.start) return false;
    if (f.end && new Date(i.createdAt) > addDays(f.end, 1)) return false; // inclusive end
    return true;
  });
}

export function sortIssues(list: Issue[], key: SortKey, dir: SortDir): Issue[] {
  const mult = dir === "asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    const va = key === "priority" ? a.priority : key === "upvotes" ? a.upvotes : key === "status" ? a.status : a.createdAt;
    const vb = key === "priority" ? b.priority : key === "upvotes" ? b.upvotes : key === "status" ? b.status : b.createdAt;
    if (va < vb) return -1 * mult;
    if (va > vb) return 1 * mult;
    return 0;
  });
}

export function paginate<T>(arr: T[], page: number, perPage: number) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * perPage;
  const end = start + perPage;
  return { page: p, pages, total, items: arr.slice(start, end) };
}

export function metrics(issues: Issue[]) {
  const total = issues.length;
  const byStatus = STATUS.reduce((acc, s) => {
    acc[s] = issues.filter((i) => i.status === s).length;
    return acc;
  }, {} as Record<Status, number>);
  const avgResolutionHrs = (() => {
    const resolved = issues.filter((i) => i.status === "Resolved");
    if (!resolved.length) return 0;
    const sum = resolved.reduce((acc, i) => acc + (new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime()), 0);
    return Math.round(sum / resolved.length / 3_600_000);
  })();
  return { total, byStatus, avgResolutionHrs };
}
