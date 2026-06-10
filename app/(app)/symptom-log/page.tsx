"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { symptomLogApi, authApi } from "@/app/_lib/api";
import type { SymptomLog, WeeklySummary } from "@/app/_lib/types";
import { Loader2, CheckCircle } from "lucide-react";

interface SymptomEntry {
  energy: number;
  bloating: number;
  cravings: number;
  acne: number;
  notes: string;
}

function SymptomSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium text-gray-700">{value}/5</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => onChange(v[0])} min={1} max={5} step={1} className="py-2" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

export default function SymptomLogPage() {
  const [subscription, setSubscription] = useState<{ tier: string } | null>(null);
  const [todayLog, setTodayLog] = useState<SymptomLog | null>(null);
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<SymptomEntry>({ energy: 3, bloating: 3, cravings: 3, acne: 3, notes: "" });

  useEffect(() => {
    async function load() {
      try {
const [sub, data] = await Promise.all([authApi.subscription(), symptomLogApi.get()]);
        setSubscription(sub as any);
setLogs((data.logs || []) as SymptomLog[]);
if (data.weekly_summary) setWeeklySummary(data.weekly_summary as WeeklySummary);
        const logs = (data.logs || []) as SymptomLog[];
        const today = new Date().toISOString().split("T")[0];
        const todayEntry = logs.find((l) => l.log_date?.split("T")[0] === today);
        if (todayEntry) {
          setTodayLog(todayEntry);
          setForm({ energy: todayEntry.energy, bloating: todayEntry.bloating, cravings: todayEntry.cravings, acne: todayEntry.acne, notes: todayEntry.notes || "" });
        }
      } catch {}
    }
    load().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const result = await symptomLogApi.submit({ energy: form.energy, bloating: form.bloating, cravings: form.cravings, acne: form.acne, notes: form.notes || undefined });
      setTodayLog(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Symptom Log</h1>
      <p className="mt-1 text-gray-600">Track how you feel each day</p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>{todayLog ? "Update your entry for today" : "Log your first entry of the day"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SymptomSlider label="Energy" value={form.energy} onChange={(v) => setForm((f) => ({ ...f, energy: v }))} />
          <SymptomSlider label="Bloating" value={form.bloating} onChange={(v) => setForm((f) => ({ ...f, bloating: v }))} />
          <SymptomSlider label="Cravings" value={form.cravings} onChange={(v) => setForm((f) => ({ ...f, cravings: v }))} />
          <SymptomSlider label="Acne" value={form.acne} onChange={(v) => setForm((f) => ({ ...f, acne: v }))} />
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea placeholder="Any additional notes about how you're feeling..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          {saved && <Alert className="border-green-200 bg-green-50"><CheckCircle className="h-4 w-4 text-green-600" /><AlertDescription className="text-green-700">Saved!</AlertDescription></Alert>}
          <Button onClick={handleSubmit} disabled={saving} className="w-full">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{todayLog ? "Update Entry" : "Save Entry"}</Button>
        </CardContent>
      </Card>
      {subscription?.tier !== "free" && weeklySummary && (
        <Card className="mt-6">
          <CardHeader><CardTitle>This Week&apos;s Summary</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">{weeklySummary.avg_energy.toFixed(1)}</p><p className="text-sm text-gray-500">Avg Energy</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">{weeklySummary.avg_bloating.toFixed(1)}</p><p className="text-sm text-gray-500">Avg Bloating</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">{weeklySummary.avg_cravings.toFixed(1)}</p><p className="text-sm text-gray-500">Avg Cravings</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">{weeklySummary.avg_acne.toFixed(1)}</p><p className="text-sm text-gray-500">Avg Acne</p></div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
