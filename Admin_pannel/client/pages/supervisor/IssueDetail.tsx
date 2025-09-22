import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useSupervisorStore } from "@/hooks/useSupervisorStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadIssueImage, isFirebaseConfigured, getIssueLocation } from "@/lib/firebase";

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { issues } = useData();
  const { user } = useAuth();
  const { acknowledge, addImage, get } = useSupervisorStore();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const issue = useMemo(() => issues.find((i) => i.id === id), [issues, id]);
  const state = get(id || "");
  const ack = !!state.acknowledgedAt;

  const [coords, setCoords] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  useEffect(() => {
    if (!issue) return;
    let active = true;
    (async () => {
      try {
        const fromDb = await getIssueLocation(issue.id);
        if (active && fromDb) {
          setCoords(fromDb);
        } else if (active) {
          setCoords({ latitude: issue.latitude, longitude: issue.longitude, address: issue.address });
        }
      } catch {
        if (active) setCoords({ latitude: issue.latitude, longitude: issue.longitude, address: issue.address });
      }
    })();
    return () => { active = false; };
  }, [issue]);

  if (!issue) return <div className="text-sm text-muted-foreground">Issue not found</div>;

  const canAccess = (() => {
    if (!user) return false;
    const norm = user.name.toLowerCase().replace(/\s+/g, "-");
    return issue.assignment.staffId === norm || issue.assignment.staffName === user.name;
  })();
  if (!canAccess) return <div className="text-sm text-muted-foreground">You do not have access to this issue.</div>;

  const onFile = async (f: File) => {
    if (isFirebaseConfigured()) {
      try {
        const url = await uploadIssueImage(issue.id, f, { name: user?.name, id: user?.email });
        addImage(issue.id, url);
        return;
      } catch {
        // fall back to local data URL if cloud upload fails
      }
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      addImage(issue.id, dataUrl);
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{issue.title}</span>
              <Badge variant="outline">{issue.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <img src={issue.imageUrl || "/placeholder.svg"} alt={issue.title} className="w-full h-56 object-cover rounded-md border" />
            <p className="text-sm text-muted-foreground">{issue.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Address:</span> {issue.address}</div>
              <div><span className="text-muted-foreground">Created:</span> {new Date(issue.createdAt).toLocaleString()}</div>
              <div><span className="text-muted-foreground">Status:</span> <Badge className="capitalize" variant={issue.status === "Resolved" ? "secondary" : issue.status === "In Progress" ? "outline" : "default"}>{issue.status}</Badge></div>
              <div><span className="text-muted-foreground">Assigned:</span> {issue.assignment.staffName || "Unassigned"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && onFile(e.target.files[0])} />
            <Button onClick={() => fileRef.current?.click()} variant="outline">Upload image</Button>
            {state.images && state.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {state.images.map((src, idx) => (
                  <img key={idx} src={src} alt={`upload-${idx}`} className="w-full h-32 object-cover rounded-md border" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => acknowledge(issue.id)} disabled={ack} className="w-full">{ack ? "Acknowledged" : "Acknowledge"}</Button>
            <Button asChild variant="outline" className="w-full"><Link to="/supervisor/issues">Back to issues</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {coords ? (
              <>
                <div className="text-sm text-muted-foreground">{coords.address || "Map view of reported location"}</div>
                <div className="rounded-md overflow-hidden border">
                  <iframe
                    title="map"
                    className="w-full h-64"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&z=16&output=embed`}
                  />
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Loading map...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
