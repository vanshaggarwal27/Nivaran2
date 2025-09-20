import { useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CATEGORIES, STATUS, Issue, IssueFilter, SortDir, SortKey, filterIssues, paginate, sortIssues } from "@/lib/nivaran";
import { CalendarIcon, ChevronDown, UserCheck2 } from "lucide-react";
import { addDays, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function Issues() {
  const { issues, assign, setStatus } = useData();
  const [filter, setFilter] = useState<IssueFilter>({ onlyCanonical: true });
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const filtered = useMemo(() => filterIssues(issues, filter), [issues, filter]);
  const sorted = useMemo(() => sortIssues(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);
  const pageData = useMemo(() => paginate(sorted, page, perPage), [sorted, page, perPage]);

  function changeStatus(i: Issue, status: string) {
    if (status === i.status) return;
    if (status === "Pending" || status === "In Progress" || status === "Resolved") setStatus(i.id, status);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-6">
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
        <div>
          <Label>Only canonical (merge duplicates)</Label>
          <Select value={filter.onlyCanonical ? "yes" : "no"} onValueChange={(v) => setFilter((f) => ({ ...f, onlyCanonical: v === "yes" }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date range</Label>
          <div className="flex gap-2">
            <DateInput date={filter.start || null} setDate={(d) => setFilter((f) => ({ ...f, start: d }))} placeholder="Start" />
            <DateInput date={filter.end || null} setDate={(d) => setFilter((f) => ({ ...f, end: d }))} placeholder="End" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <div className="text-sm text-muted-foreground">{pageData.total.toLocaleString()} results</div>
        <div className="flex items-center gap-2">
          <Select value={sortKey} onValueChange={(v: SortKey) => setSortKey(v)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="upvotes">Upvotes</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortDir} onValueChange={(v: SortDir) => setSortDir(v)}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(perPage)} onValueChange={(v) => setPerPage(parseInt(v))}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}/page</SelectItem>)}
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
              <TableHead>Upvotes</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={i.imageUrl || "/placeholder.svg"} alt={i.title} className="size-10 rounded-md object-cover border" />
                    <div>
                      <div className="font-medium leading-5">{i.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{i.category}</Badge></TableCell>
                <TableCell className="max-w-[200px] truncate">{i.address}</TableCell>
                <TableCell className="font-mono">{i.upvotes}</TableCell>
                <TableCell className="font-mono">{priorityLabel(i.priority)}</TableCell>
                <TableCell>
                  <Select value={i.status} onValueChange={(v) => changeStatus(i, v)}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{i.assignment.staffName ? <span className="flex items-center gap-1 text-sm"><UserCheck2 className="size-4" />{i.assignment.staffName}</span> : <span className="text-muted-foreground text-sm">Unassigned</span>}</TableCell>
                <TableCell className="text-right">
                  <AssignDialog issue={i} onAssign={(name) => assign(i.id, name)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Page {pageData.page} of {pageData.pages}</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} /></PaginationItem>
            <PaginationItem><PaginationNext onClick={() => setPage((p) => Math.min(pageData.pages, p + 1))} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function priorityLabel(p: number) {
  return p === 1 ? "High" : p === 2 ? "Medium" : "Low";
}

function AssignDialog({ issue, onAssign }: { issue: Issue; onAssign: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Assign</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign field staff</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="text-sm text-muted-foreground">{issue.title}</div>
          <div className="grid gap-1">
            <Label>Staff name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter staff full name" />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => name && onAssign(name)} disabled={!name}>Assign</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DateInput({ date, setDate, placeholder }: { date: Date | null; setDate: (d: Date | null) => void; placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date ?? undefined} onSelect={(d) => setDate(d ?? null)} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
