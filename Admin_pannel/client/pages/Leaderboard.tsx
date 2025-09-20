import { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
  const { issues } = useData();

  const topCitizens = useMemo(() => {
    const map = new Map<string, { name: string; count: number; upvotes: number }>();
    for (const i of issues) {
      const c = map.get(i.reporter.id) || { name: i.reporter.name, count: 0, upvotes: 0 };
      c.count++;
      c.upvotes += i.upvotes;
      map.set(i.reporter.id, c);
    }
    return [...map.values()].sort((a, b) => (b.count - a.count) || (b.upvotes - a.upvotes)).slice(0, 20);
  }, [issues]);

  const topWards = useMemo(() => {
    const map = new Map<string, { open: number; total: number }>();
    for (const i of issues) {
      const key = i.address.split(",")[0]; // Ward X
      const cur = map.get(key) || { open: 0, total: 0 };
      cur.total++;
      if (i.status !== "Resolved") cur.open++;
      map.set(key, cur);
    }
    return [...map.entries()].map(([ward, v]) => ({ ward, ...v })).sort((a, b) => b.open - a.open).slice(0, 20);
  }, [issues]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="text-yellow-500" /> Top contributing citizens</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Citizen</TableHead>
                <TableHead className="text-right">Reports</TableHead>
                <TableHead className="text-right">Total upvotes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCitizens.map((c) => (
                <TableRow key={c.name}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="text-right font-mono">{c.count}</TableCell>
                  <TableCell className="text-right font-mono">{c.upvotes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wards with highest open issues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward</TableHead>
                <TableHead className="text-right">Open</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topWards.map((w) => (
                <TableRow key={w.ward}>
                  <TableCell>{w.ward}</TableCell>
                  <TableCell className="text-right font-mono">{w.open}</TableCell>
                  <TableCell className="text-right font-mono">{w.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
