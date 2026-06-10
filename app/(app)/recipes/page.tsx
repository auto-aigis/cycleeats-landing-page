"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { recipesApi, authApi } from "@/app/_lib/api";
import type { CuratedRecipe } from "@/app/_lib/types";
import { Loader2, Lock, Crown } from "lucide-react";

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<CuratedRecipe[]>([]);
  const [subscription, setSubscription] = useState<{ can_use_recipes: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const sub = await authApi.subscription();
        setSubscription(sub);
        if (sub.can_use_recipes) {
          const data = await recipesApi.getAll();
          setRecipes(data);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Plus")) router.push("/pricing");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) return <div className="mx-auto max-w-5xl p-6"><Skeleton className="h-8 w-48" /><div className="mt-6 grid gap-4 md:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div></div>;

  if (!subscription?.can_use_recipes) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader><Lock className="mx-auto h-12 w-12 text-gray-400" /><CardTitle className="mt-4">PCOS Essentials Collection</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">This feature is available for Plus subscribers. Get access to 20+ curated PCOS-friendly recipes.</p>
            <Button onClick={() => router.push("/pricing")}><Crown className="mr-2 h-4 w-4" />Upgrade to Plus</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center gap-3"><h1 className="text-2xl font-semibold text-gray-900">PCOS Essentials</h1><Badge variant="outline" className="border-green-200 bg-green-50 text-green-700"><Crown className="mr-1 h-3 w-3" />Plus Only</Badge></div>
      <p className="mt-1 text-gray-600">Curated recipes validated for PCOS-friendly nutrition</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader><CardTitle className="text-lg">{recipe.name}</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap gap-2">{recipe.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
              <p className="text-sm text-gray-600">{recipe.pcos_rationale}</p>
              <details className="mt-3"><summary className="cursor-pointer text-sm text-green-600 hover:underline">View ingredients</summary><ul className="mt-2 list-inside list-disc text-sm text-gray-600">{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul></details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
