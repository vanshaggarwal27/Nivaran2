import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const KEY = "niva:settings:v1";

type Settings = {
  emailEnabled: boolean;
  emailFrom: string;
  smsEnabled: boolean;
  smsProvider: string;
  webhookUrl: string;
};

export default function Settings() {
  const [s, setS] = useState<Settings>({ emailEnabled: true, emailFrom: "alerts@nivaran.gov", smsEnabled: false, smsProvider: "", webhookUrl: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) try { setS(JSON.parse(raw)); } catch {}
  }, []);

  function save() {
    localStorage.setItem(KEY, JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Email & SMS notifications</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable email alerts</Label>
              <p className="text-xs text-muted-foreground">Notify staff on assignment and citizens on resolution</p>
            </div>
            <Switch checked={s.emailEnabled} onCheckedChange={(v) => setS((x) => ({ ...x, emailEnabled: v }))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Sender address</Label>
            <Input value={s.emailFrom} onChange={(e) => setS((x) => ({ ...x, emailFrom: e.target.value }))} placeholder="alerts@niva.gov" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable SMS alerts</Label>
              <p className="text-xs text-muted-foreground">Requires SMS provider integration</p>
            </div>
            <Switch checked={s.smsEnabled} onCheckedChange={(v) => setS((x) => ({ ...x, smsEnabled: v }))} />
          </div>
          <div className="grid gap-1.5">
            <Label>SMS provider name</Label>
            <Input value={s.smsProvider} onChange={(e) => setS((x) => ({ ...x, smsProvider: e.target.value }))} placeholder="e.g. Twilio" />
          </div>
          <Button onClick={save}>{saved ? "Saved" : "Save"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>ERP/CRM webhook URL</Label>
            <Input value={s.webhookUrl} onChange={(e) => setS((x) => ({ ...x, webhookUrl: e.target.value }))} placeholder="https://example.gov/webhooks/nivaran" />
            <p className="text-xs text-muted-foreground">We will POST issue status updates to this endpoint.</p>
          </div>
          <Button onClick={save}>{saved ? "Saved" : "Save"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
