import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useSupervisorStore } from "@/hooks/useSupervisorStore";

export default function Notifications() {
  const { user } = useAuth();
  const { issues } = useData();
  const { get } = useSupervisorStore();

  const items = useMemo(() => {
    const list: { id: string; type: string; title: string; at: string }[] = [];
    if (!user) return list;
    const norm = user.name.toLowerCase().replace(/\s+/g, "-");
    const mine = issues.filter((i) => i.assignment.staffId === norm || i.assignment.staffName === user.name);

    for (const i of mine) {
      const s = get(i.id);
      if (!s.acknowledgedAt) list.push({ id: i.id, type: "Pending acknowledgement", title: i.title, at: i.assignment.assignedAt || i.createdAt });
      if (i.assignment.assignedAt) {
        const assignedHrs = (Date.now() - new Date(i.assignment.assignedAt).getTime()) / 3_600_000;
        if (assignedHrs <= 48) list.push({ id: i.id, type: "New assignment", title: i.title, at: i.assignment.assignedAt });
      }
      if (i.status === "Resolved") list.push({ id: i.id, type: "Resolved", title: i.title, at: i.updatedAt });
    }
    return list.sort((a, b) => (a.at < b.at ? 1 : -1));
  }, [issues, user, get]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No notifications</div>
          ) : (
            items.map((n) => (
              <div key={n.id + n.type} className="flex items-center gap-3 rounded-md border p-3">
                <Badge variant="outline">{n.type}</Badge>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(n.at).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
