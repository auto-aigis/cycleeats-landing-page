"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { settingsApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Loader2, CheckCircle, Crown } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [settings, setSettings] = useState<{ openai_api_key_masked?: string; subscription_tier: string; billing_portal_url?: string } | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsApi.get();
        setSettings(data);
      } catch {}
    }
    load().finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(apiKey || undefined);
      setSaved(true);
      setApiKey("");
      const data = await settingsApi.get();
      setSettings(data);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const handleUpgrade = async (tier: string, interval: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier, billing_interval: interval }) });
      const { price_id } = await res.json();
      const paddle = (window as any).Paddle;
      if (paddle) { paddle.Checkout.open({ items: [{ priceId: price_id, quantity: 1 }], settings: { displayMode: "overlay" } }); }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="mx-auto max-w-2xl p-6"><Skeleton className="h-8 w-32" /><div className="mt-6 space-y-4"><Skeleton className="h-48" /><Skeleton className="h-32" /></div></div>;

  const tier = settings?.subscription_tier || "free";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <p className="mt-1 text-gray-600">Manage your account and preferences</p>
      <Card className="mt-6">
        <CardHeader><CardTitle>Subscription</CardTitle><CardDescription>Your current plan and billing</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="font-medium text-gray-900">Current plan:</span>{tier === "free" ? <Badge variant="outline">Free</Badge> : <Badge className="border-green-200 bg-green-50 text-green-700"><Crown className="mr-1 h-3 w-3" />{tier.charAt(0).toUpperCase() + tier.slice(1)}</Badge>}</div>
            {tier !== "free" && settings?.billing_portal_url && <a href={settings.billing_portal_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">Manage billing</a>}
          </div>
          {tier === "free" && <div className="flex gap-3 pt-2"><Button onClick={() => handleUpgrade("pro", "monthly")} size="sm">Upgrade to Pro</Button><Button variant="outline" onClick={() => router.push("/pricing")} size="sm">View all plans</Button></div>}
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>OpenAI API Key</CardTitle><CardDescription>Optionally provide your own API key for AI features</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {settings?.openai_api_key_masked && <p className="text-sm text-gray-500">Current key: <span className="font-mono">{settings.openai_api_key_masked}</span></p>}
          <div className="space-y-2"><Label htmlFor="apikey">API Key (optional)</Label><Input id="apikey" type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} /><p className="text-xs text-gray-500">Leave blank to use the default AI service. Your key is stored securely.</p></div>
          {saved && <Alert className="border-green-200 bg-green-50"><CheckCircle className="h-4 w-4 text-green-600" /><AlertDescription className="text-green-700">Settings saved!</AlertDescription></Alert>}
          <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
