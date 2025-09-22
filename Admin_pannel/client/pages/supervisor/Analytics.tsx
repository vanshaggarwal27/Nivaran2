import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { metrics as calcMetrics } from "@/lib/nivaran";

export default function SupervisorAnalytics() {
  const { user } = useAuth();
  const { issues } = useData();

  const myIssues = useMemo(() => {
    if (!user) return [];
    const norm = user.name.toLowerCase().replace(/\s+/g, "-");
    return issues.filter((i) => i.assignment.staffId === norm || i.assignment.staffName === user.name);
  }, [issues, user]);

  const m = useMemo(() => calcMetrics(myIssues), [myIssues]);

  const byStatus = useMemo(() => [
    { name: "Pending", count: m.byStatus["Pending"] },
    { name: "In Progress", count: m.byStatus["In Progress"] },
    { name: "Resolved", count: m.byStatus["Resolved"] },
  ], [m]);

  const byWeek = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of myIssues) {
      const d = new Date(i.createdAt);
      const k = `${d.getFullYear()}-W${Math.ceil(((d.getDate() - d.getDay() + 1) / 7))}`;
      map.set(k, (map.get(k) || 0) + 1);
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([name, value]) => ({ name, value }));
  }, [myIssues]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Status breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: "Count", color: "hsl(var(--primary))" } }}>
            <BarChart data={byStatus}>
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

      <Card>
        <CardHeader>
          <CardTitle>Reports per week</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: "Reports", color: "hsl(var(--secondary-foreground))" } }}>
            <LineChart data={byWeek}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis hide />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
