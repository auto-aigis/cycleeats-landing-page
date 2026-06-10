"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi, scannerApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Loader2, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

interface FlaggedIngredient {
  ingredient: string;
  status: string;
  explanation: string;
  swap: string;
}

export default function ScannerPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [inputType, setInputType] = useState<"text" | "url" | "description">("text");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    safety_score: string;
    flagged_ingredients: FlaggedIngredient[];
    swap_suggestions: string[];
    explanation: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<{ can_scan: boolean; scan_limit_remaining: number } | null>(null);

  const loadSubscription = async () => {
    try {
      const sub = await authApi.subscription();
      setSubscription(sub);
    } catch {}
  };
  loadSubscription();

  const handleScan = async () => {
    if (!content.trim()) return;
    if (!subscription?.can_scan) {
      router.push("/pricing");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

try {
      const scanResult = await scannerApi.scan(inputType, content);
      // Cast to the expected type
      setResult(scanResult as any);
      loadSubscription();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Scan failed";
      if (msg.includes("limit")) {
        router.push("/pricing");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreIcon = (score: string) => {
    if (score === "Safe") return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score === "Caution") return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getScoreColor = (score: string) => {
    if (score === "Safe") return "bg-green-50 border-green-200 text-green-800";
    if (score === "Caution") return "bg-amber-50 border-amber-200 text-amber-800";
    return "bg-red-50 border-red-200 text-red-800";
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Ingredient Scanner</h1>
      <p className="mt-1 text-gray-600">Check if your meal is PCOS-friendly</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scan your meal</CardTitle>
          <CardDescription>
            {subscription && (
              <span className={subscription.can_scan ? "text-gray-500" : "text-amber-600"}>
                {subscription.scan_limit_remaining} scans remaining this week
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={inputType} onValueChange={(v) => setInputType(v as typeof inputType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Paste ingredients</TabsTrigger>
              <TabsTrigger value="url">Recipe URL</TabsTrigger>
              <TabsTrigger value="description">Describe meal</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Enter ingredients, one per line:&#10;1 cup white rice&#10;200g chicken breast&#10;2 tbsp soy sauce"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px]"
              />
            </TabsContent>
            <TabsContent value="url" className="mt-4">
              <Input
                placeholder="https://example.com/recipe/..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500">We&apos;ll fetch and parse the recipe automatically</p>
            </TabsContent>
            <TabsContent value="description" className="mt-4">
              <Textarea
                placeholder="Describe your meal in plain text:&#10;Grilled chicken with white rice and steamed broccoli"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px]"
              />
            </TabsContent>
          </Tabs>

{error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
)}

          <Button onClick={handleScan} disabled={loading || !content.trim()} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Scan Ingredients
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={`mt-6 border-2 ${getScoreColor(result.safety_score)}`}>
          <CardHeader className="flex flex-row items-center gap-3">
            {getScoreIcon(result.safety_score)}
            <div>
              <CardTitle>Overall: {result.safety_score}</CardTitle>
              <CardDescription className="text-gray-600">{result.explanation}</CardDescription>
            </div>
          </CardHeader>
          {result.flagged_ingredients.length > 0 && (
            <CardContent className="space-y-4">
              <h3 className="font-medium">Flagged Ingredients</h3>
              {result.flagged_ingredients.map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.ingredient}</span>
                    <Badge
                      variant={item.status === "Safe" ? "default" : item.status === "Caution" ? "outline" : "destructive"}
                      className={
                        item.status === "Safe"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Caution"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{item.explanation}</p>
                  {item.swap && (
                    <p className="mt-1 text-sm text-green-700">
                      <span className="font-medium">Swap:</span> {item.swap}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
