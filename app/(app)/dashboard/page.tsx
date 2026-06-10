"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useAuth } from "../../_components/AuthProvider";
import { authApi, mealPlanApi, nutritionTipApi, settingsApi, paymentsApi } from "../../_lib/api";
import type { MealPlan, PCOSProfile, NutritionTip, Subscription } from "../../_lib/types";
import {
  Scan,
  Utensils,
  Calendar,
  Sparkles,
  Loader2,
  ArrowRight,
  Crown,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [profile, setProfile] = useState<PCOSProfile | null>(null);
  const [nutritionTip, setNutritionTip] = useState<NutritionTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [verifyingTransaction, setVerifyingTransaction] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.has_completed_onboarding) {
      router.push("/onboarding");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const transactionId = searchParams.get("transaction_id");
    if (checkout === "success" && transactionId) {
      setVerifyingTransaction(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paddle/verify-transaction`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: transactionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "active") {
            refresh();
            window.history.replaceState(null, "", "/dashboard");
          }
        })
        .catch(() => {})
        .finally(() => setVerifyingTransaction(false));
    }
  }, [searchParams, refresh]);

  useEffect(() => {
    async function loadData() {
      try {
        const [sub, plan, tip, settingsData] = await Promise.all([
          authApi.subscription(),
          mealPlanApi.getCurrent(),
          nutritionTipApi.get().catch(() => null),
          settingsApi.get().catch(() => null),
        ]);

        // Cast tier to the expected literal type
        const typedSub: Subscription = {
          ...sub,
          tier: sub.tier as "free" | "pro" | "plus",
        };
        setSubscription(typedSub);
        // Cast to the expected type
        setMealPlan(plan as MealPlan);
        if (tip) setNutritionTip(tip);
        if (settingsData?.subscription_tier !== "free") {
          try {
            const profileData = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding`,
              { credentials: "include" }
            ).then((r) => r.json());
            setProfile(profileData);
          } catch {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.has_completed_onboarding) loadData();
  }, [user]);

  const handleGeneratePlan = async () => {
    if (!subscription?.can_generate_meal_plan) {
      setUpgradeOpen(true);
      return;
    }
    setGenerating(true);
try {
      const result = await mealPlanApi.generate();
      setMealPlan({ has_plan: true, plan: result.plan as MealPlan["plan"], week_start_date: result.week_start_date });
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    try {
      const { price_id } = await paymentsApi.checkout(tier, "monthly");
      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          settings: { displayMode: "overlay" },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !subscription) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const currentPlan = mealPlan?.plan?.days?.[0];

  return (
    <div className="mx-auto max-w-5xl p-6">
      {verifyingTransaction && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription className="ml-2">Processing payment... please wait.</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back!</h1>
          <p className="mt-1 text-gray-600">Here&apos;s your PCOS nutrition overview</p>
        </div>
        {subscription.tier !== "free" && (
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
            <Crown className="mr-1 h-3 w-3" />
            {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
          </Badge>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">This Week&apos;s Meals</CardTitle>
            <Utensils className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {mealPlan?.has_plan && currentPlan ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium text-gray-900">Today&apos;s sample</p>
                  <p className="text-sm text-gray-600">{currentPlan.breakfast?.name || "Breakfast"}</p>
                  <p className="text-sm text-gray-500">{currentPlan.lunch?.name || "Lunch"}</p>
                  <p className="text-sm text-gray-500">{currentPlan.dinner?.name || "Dinner"}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGeneratePlan}
                  disabled={generating}
                >
                  {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Regenerate Plan
                </Button>
                {!subscription.can_generate_meal_plan && (
                  <p className="text-xs text-gray-500">
                    {subscription.tier === "free"
                      ? "1 free plan/week. Upgrade for unlimited."
                      : "Limit reached"}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <p className="text-gray-500">No meal plan yet</p>
                <Button className="mt-3" onClick={handleGeneratePlan} disabled={generating}>
                  {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Your First Plan
                </Button>
              </div>
            )}
            <Link href="/meal-plan" className="mt-4 inline-flex items-center text-sm text-green-600 hover:underline">
              View full plan <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Ingredient Scanner</CardTitle>
            <Scan className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="mb-3 text-gray-500">Check if ingredients are PCOS-friendly</p>
              <div className="space-y-2">
                {subscription.can_scan ? (
                  <Link href="/scanner">
                    <Button>Scan Now</Button>
                  </Link>
                ) : (
                  <>
                    <Button onClick={() => setUpgradeOpen(true)}>Upgrade to Scan More</Button>
                    <p className="text-xs text-gray-500">
                      {subscription.scan_limit_remaining} scans remaining this week
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {nutritionTip && subscription.can_use_nutrition_tip && (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">This Week&apos;s Tip</CardTitle>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{nutritionTip.tip_text}</p>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Your PCOS Profile</CardTitle>
            <Calendar className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Goal:</span> {profile.primary_goal}</p>
                <p><span className="font-medium">Cycle phase:</span> {profile.cycle_phase}</p>
                <p><span className="font-medium">Dietary preferences:</span> {profile.dietary_exclusions?.join(", ") || "None"}</p>
                <Link href="/settings" className="mt-2 inline-block text-sm text-green-600 hover:underline">
                  Edit profile →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Complete your profile to get personalized recommendations</p>
            )}
          </CardContent>
        </Card>
      </div>

      {upgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>Unlock unlimited meal plans and scans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => handleUpgrade("pro")}>
                Upgrade to Pro — $9.99/month
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/pricing")}>
                View all plans
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setUpgradeOpen(false)}>
                Maybe later
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}