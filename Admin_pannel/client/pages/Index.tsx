import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Clock, ListChecks, Sparkles } from "lucide-react";
import { useData } from "@/context/DataContext";
import { metrics as calcMetrics } from "@/lib/nivaran";

export default function Index() {
  const { issues } = useData();
  const m = useMemo(() => calcMetrics(issues), [issues]);

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of issues) {
      const d = new Date(i.createdAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      map.set(k, (map.get(k) || 0) + 1);
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, value]) => ({ date, value }));
  }, [issues]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of issues) map.set(i.category, (map.get(i.category) || 0) + 1);
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [issues]);

  const recent = useMemo(() => [...issues].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8), [issues]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">NIVARAN</h1>
          <p className="text-sm text-muted-foreground">Crowdsourced Civic Issue Reporting & Resolution</p>
        </div>
        <Badge className="gap-1"><Sparkles className="size-4" /> Real-time</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Issues" value={m.total.toLocaleString()} icon={<ListChecks className="text-primary" />} trend={{ dir: "up", text: "+8% vs last week" }} />
        <StatCard title="Pending" value={m.byStatus["Pending"].toLocaleString()} chip="Pending" />
        <StatCard title="In Progress" value={m.byStatus["In Progress"].toLocaleString()} chip="In Progress" />
        <StatCard title="Resolved" value={m.byStatus["Resolved"].toLocaleString()} chip="Resolved" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Reports over time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ Reports: { label: "Reports", color: "hsl(var(--primary))" } }}>
              <AreaChart data={byDay} margin={{ left: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} tickMargin={8} />
                <YAxis hide />
                <Area type="monotone" dataKey="value" stroke="var(--color-Reports)" fill="var(--color-Reports)" fillOpacity={0.15} />
                <ChartTooltip content={<ChartTooltipContent nameKey="Reports" />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Count", color: "hsl(var(--secondary-foreground))" } }}>
              <BarChart data={byCategory}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis hide />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {recent.map((i) => (
              <div key={i.id} className="flex items-center gap-3 rounded-md border p-3">
                <img src={i.imageUrl || "/placeholder.svg"} alt={i.title} className="size-12 rounded-md object-cover border" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{i.title}</p>
                    <Badge variant="outline" className="shrink-0">{i.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{i.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Upvotes</div>
                  <div className="font-mono">{i.upvotes}</div>
                </div>
                <div className="text-right w-24">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge className="capitalize" variant={i.status === "Resolved" ? "secondary" : i.status === "In Progress" ? "outline" : "default"}>{i.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 grid gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" /> Average resolution time
          </div>
          <div className="text-2xl font-semibold">{m.avgResolutionHrs} hrs</div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, chip, icon, trend }: { title: string; value: string; chip?: string; icon?: React.ReactNode; trend?: { dir: "up" | "down"; text: string } }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {chip && <Badge variant="outline" className="capitalize">{chip}</Badge>}
          {trend && (
            <span className={"text-xs flex items-center gap-1 " + (trend.dir === "up" ? "text-emerald-600" : "text-red-600")}>
              {trend.dir === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {trend.text}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
