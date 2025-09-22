import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useSupervisorStore } from "@/hooks/useSupervisorStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORIES, STATUS, Issue, IssueFilter, filterIssues, paginate, sortIssues, SortDir, SortKey } from "@/lib/nivaran";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SupervisorIssues() {
  const { user } = useAuth();
  const { issues, ensureMockFor } = useData();
  const { acknowledge, get } = useSupervisorStore();
  const [filter, setFilter] = useState<IssueFilter>({ onlyCanonical: true });
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const myIssues = useMemo(() => {
    if (!user) return [] as Issue[];
    const norm = user.name.toLowerCase().replace(/\s+/g, "-");
    return issues.filter((i) => i.assignment.staffId === norm || i.assignment.staffName === user.name);
  }, [issues, user]);

  const filtered = useMemo(() => filterIssues(myIssues, filter), [myIssues, filter]);
  const sorted = useMemo(() => sortIssues(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);
  const pageData = useMemo(() => paginate(sorted, page, perPage), [sorted, page, perPage]);

  useEffect(() => {
    if (!user) return;
    const norm = user.name.toLowerCase().replace(/\s+/g, "-");
    const has = issues.some((i) => i.assignment.staffId === norm || i.assignment.staffName === user.name);
    if (!has) ensureMockFor(user.name);
  }, [user, issues, ensureMockFor]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <Label>Search</Label>
          <Input placeholder="Search title, description, address" value={filter.query || ""} onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))} />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={(filter.category as any) || "All"} onValueChange={(v) => setFilter((f) => ({ ...f, category: v as any }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={(filter.status as any) || "All"} onValueChange={(v) => setFilter((f) => ({ ...f, status: v as any }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.items.map((i) => {
              const s = get(i.id);
              const ack = !!s.acknowledgedAt;
              return (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={i.imageUrl || "/placeholder.svg"} alt={i.title} className="size-10 rounded-md object-cover border" />
                      <div>
                        <div className="font-medium leading-5"><Link to={`/supervisor/issues/${i.id}`} className="hover:underline">{i.title}</Link></div>
                        <div className="text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{i.category}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate">{i.address}</TableCell>
                  <TableCell>
                    <Badge className="capitalize" variant={i.status === "Resolved" ? "secondary" : i.status === "In Progress" ? "outline" : "default"}>{i.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant={ack ? "outline" : "default"} onClick={() => acknowledge(i.id)} disabled={ack}>
                      {ack ? "Acknowledged" : "Acknowledge"}
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/supervisor/issues/${i.id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
