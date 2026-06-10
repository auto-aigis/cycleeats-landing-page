"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { askApi, authApi } from "../../_lib/api";
import type { AskUsage } from "../../_lib/types";
import { Loader2, Lock, Crown, Send, MessageCircle } from "lucide-react";

interface Message { id: string; question: string; answer: string; asked_at: string; }

export default function AskPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<{ can_use_ask: boolean } | null>(null);
  const [usage, setUsage] = useState<AskUsage | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const sub = await authApi.subscription();
        setSubscription(sub);
        if (sub.can_use_ask) { const u = await askApi.usage(); setUsage(u); }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Plus")) router.push("/pricing");
      } finally { setLoading(false); }
    }
    load();
  }, [router]);

  const handleAsk = async () => {
    if (!question.trim() || !subscription?.can_use_ask) return;
    setAsking(true);
    const q = question;
    setQuestion("");
    try {
      const response = await askApi.ask(q);
      setMessages((prev) => [...prev, response]);
      const u = await askApi.usage();
      setUsage(u);
    } catch (err) { console.error(err); }
    setAsking(false);
  };

  if (loading) return <div className="mx-auto max-w-3xl p-6"><Skeleton className="h-8 w-48" /><div className="mt-6 space-y-4"><Skeleton className="h-32" /></div></div>;

  if (!subscription?.can_use_ask) return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader><Lock className="mx-auto h-12 w-12 text-gray-400" /><CardTitle className="mt-4">Ask CycleEats</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Get personalized PCOS nutrition answers. This feature is available for Plus subscribers.</p>
          <Button onClick={() => router.push("/pricing")}><Crown className="mr-2 h-4 w-4" />Upgrade to Plus</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold text-gray-900">Ask CycleEats</h1><p className="mt-1 text-gray-600">Get personalized PCOS nutrition answers</p></div>{usage && <Badge variant="outline">{usage.questions_remaining}/10 questions remaining</Badge>}</div>
      <Card className="mt-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" />Ask a question</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="e.g., What foods help with PCOS cravings?" value={question} onChange={(e) => setQuestion(e.target.value)} disabled={asking || (usage?.questions_remaining ?? 0) <= 0} className="min-h-[100px]" />
          <Button onClick={handleAsk} disabled={asking || !question.trim() || (usage?.questions_remaining ?? 0) <= 0} className="w-full">{asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Ask Question</Button>
          {(usage?.questions_remaining ?? 0) <= 0 && <Alert><AlertDescription>You&apos;ve reached your monthly question limit. Upgrade for more!</AlertDescription></Alert>}
        </CardContent>
      </Card>
      <div className="mt-6 space-y-4">{messages.map((msg) => <Card key={msg.id} className="border-green-200 bg-green-50"><CardContent className="pt-4"><p className="font-medium text-gray-900">Q: {msg.question}</p><p className="mt-2 text-gray-700">A: {msg.answer}</p></CardContent></Card>)}</div>
    </div>
  );
}
