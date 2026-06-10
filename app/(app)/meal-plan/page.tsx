"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi, mealPlanApi, settingsApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Loader2, RefreshCw } from "lucide-react";

interface Meal {
  name: string;
  why_this_works: string;
  glycemic_load: string;
  glycemic_explanation: string;
  swap_suggestion: string;
}

interface MealPlanDay {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

interface MealPlan {
  has_plan: boolean;
  plan?: { days: MealPlanDay[] };
}

function GlycemicBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-red-100 text-red-800",
  };
  return <Badge className={colors[level] || "bg-gray-100"}>{level}</Badge>;
}

export default function MealPlanPage() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [subscription, setSubscription] = useState<{ can_generate_meal_plan: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [plan, sub] = await Promise.all([mealPlanApi.getCurrent(), authApi.subscription()]);
        setMealPlan(plan as MealPlan);
        setSubscription(sub);
      } catch {}
    }
    load().finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    if (!subscription?.can_generate_meal_plan) return;
    setGenerating(true);
    try {
      const result = await mealPlanApi.generate(dietaryFilters);
      setMealPlan({ has_plan: true, plan: result.plan as { days: MealPlanDay[] } });
    } catch {}
    setGenerating(false);
  };

  const days = mealPlan?.plan?.days || [];

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Weekly Meal Plan</h1>
          <p className="mt-1 text-gray-600">PCOS-friendly meals for the week</p>
        </div>
        {subscription?.can_generate_meal_plan && (
          <Button onClick={handleGenerate} disabled={generating}>
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        )}
      </div>

      {!mealPlan?.has_plan ? (
        <Card className="mt-6">
          <CardContent className="flex h-64 flex-col items-center justify-center">
            <p className="text-gray-500">No meal plan generated yet</p>
            {subscription?.can_generate_meal_plan ? (
              <Button className="mt-4" onClick={handleGenerate} disabled={generating}>
                Generate Your First Plan
              </Button>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Upgrade to generate meal plans</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {days.map((day, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{day.day || `Day ${idx + 1}`}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
                  const meal = day[mealType as keyof MealPlanDay] as Meal | undefined;
                  if (!meal) return null;
                  return (
                    <div key={mealType} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize text-gray-900">{mealType}</span>
                        <GlycemicBadge level={meal.glycemic_load} />
                      </div>
                      <p className="mt-2 font-medium text-gray-900">{meal.name}</p>
                      <p className="mt-1 text-sm text-gray-600">{meal.why_this_works}</p>
                      <p className="mt-2 text-xs text-gray-500">{meal.glycemic_explanation}</p>
                      {meal.swap_suggestion && (
                        <p className="mt-2 text-sm text-green-700">
                          <span className="font-medium">Swap:</span> {meal.swap_suggestion}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}