import { useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Analytics() {
  const { issues, regenerate } = useData();
  const [count, setCount] = useState(10000);

  const byMonth = useMemo(() => {
    const map = new Map<string, { reported: number; resolved: number }>();
    for (const i of issues) {
      const d = new Date(i.createdAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const cur = map.get(k) || { reported: 0, resolved: 0 };
      cur.reported++;
      if (i.status === "Resolved") cur.resolved++;
      map.set(k, cur);
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([month, v]) => ({ month, ...v }));
  }, [issues]);

  const byPriority = useMemo(() => {
    const map = new Map<number, number>();
    for (const i of issues) map.set(i.priority, (map.get(i.priority) || 0) + 1);
    return [1, 2, 3].map((p) => ({ priority: p === 1 ? "High" : p === 2 ? "Medium" : "Low", count: map.get(p) || 0 }));
  }, [issues]);

  return (
    <div className="grid gap-4">
      <div className="flex items-end gap-2">
        <div>
          <div className="text-sm font-medium">Dataset size</div>
          <div className="text-xs text-muted-foreground">Regenerate synthetic dataset for scalability tests</div>
        </div>
        <Input type="number" className="w-32" min={1000} max={20000} value={count} onChange={(e) => setCount(parseInt(e.target.value || "0"))} />
        <Button onClick={() => regenerate(count)} disabled={!count || count < 1000}>Regenerate</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reported vs Resolved (monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ reported: { label: "Reported", color: "hsl(var(--primary))" }, resolved: { label: "Resolved", color: "hsl(var(--accent))" } }}>
            <LineChart data={byMonth} margin={{ left: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis />
              <Line type="monotone" dataKey="reported" stroke="var(--color-reported)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} dot={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: "Count", color: "hsl(var(--secondary-foreground))" } }}>
            <BarChart data={byPriority}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="priority" tickLine={false} axisLine={false} />
              <YAxis />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
