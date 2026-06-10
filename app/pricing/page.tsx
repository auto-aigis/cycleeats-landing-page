"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { authApi, paymentsApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Check, Crown, Zap } from "lucide-react";

const tiers = [
  { id: "free", name: "Free", monthlyPrice: 0, yearlyPrice: 0, features: ["1 AI meal plan per week", "3 ingredient scans per week", "PCOS onboarding quiz", "Basic symptom logging"], cta: "Current Plan", variant: "outline" as const },
  { id: "pro", name: "Pro", monthlyPrice: 9.99, yearlyPrice: 89, yearlySavings: 26, features: ["Unlimited meal plan generations", "Unlimited ingredient scans", "Dietary preference filters", "Weekly PCOS nutrition tips", "Symptom weekly summary", "Priority email support"], cta: "Upgrade to Pro", popular: true },
  { id: "plus", name: "Plus", monthlyPrice: 14.99, yearlyPrice: 129, yearlySavings: 28, features: ["Everything in Pro", "Hormone phase-aware meal planning", "PCOS Essentials recipe collection", "10 Ask CycleEats questions/month", "Early access to new features"], cta: "Upgrade to Plus" },
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const [annual, setAnnual] = useState(true);
  const [subscription, setSubscription] = useState<{ tier: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) { authApi.subscription().then(setSubscription).catch(() => setSubscription(null)); }
  }, [user]);

  const handleSubscribe = async (tier: string) => {
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    try {
      const billingInterval = annual ? "yearly" : "monthly";
      const { price_id } = await paymentsApi.checkout(tier, billingInterval);
      const paddle = (window as any).Paddle;
      if (paddle) { paddle.Checkout.open({ items: [{ priceId: price_id, quantity: 1 }], settings: { displayMode: "overlay" } }); }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const currentTier = subscription?.tier || "free";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center"><h1 className="text-3xl font-bold text-gray-900">Choose your plan</h1><p className="mt-2 text-gray-600">Start with the Free plan, or upgrade for unlimited access</p></div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Label htmlFor="annual" className={annual ? "text-gray-900" : "text-gray-500"}>Monthly</Label>
          <Switch id="annual" checked={annual} onCheckedChange={setAnnual} />
          <Label htmlFor="annual" className={annual ? "text-gray-500" : "text-gray-900"}>Annual</Label>
          {annual && <Badge variant="outline" className="ml-2 border-green-200 bg-green-50 text-green-700">Save up to 28%</Badge>}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const price = annual ? tier.yearlyPrice : tier.monthlyPrice;
            const isCurrent = currentTier === tier.id;
            const isUpgradePlus = tier.id === "plus" && currentTier === "pro";
            return (
              <Card key={tier.id} className={`relative ${tier.popular ? "border-green-500 shadow-lg" : ""}`}>
                {tier.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">Most Popular</Badge>}
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">{tier.name}{tier.id === "pro" && <Zap className="h-5 w-5 text-amber-500" />}{tier.id === "plus" && <Crown className="h-5 w-5 text-purple-500" />}</CardTitle>
                  <CardDescription>
                    {tier.id === "free" ? <span className="text-2xl font-bold text-gray-900">Free</span> : <div className="flex items-center justify-center gap-1"><span className="text-3xl font-bold text-gray-900">${price}</span>{annual ? <span className="text-gray-500">/year</span> : <span className="text-gray-500">/month</span>}</div>}
                    {annual && tier.yearlySavings && <span className="text-sm text-green-600">Save {tier.yearlySavings}% vs monthly</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent><ul className="space-y-3">{tier.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" /><span className="text-sm text-gray-600">{feature}</span></li>)}</ul></CardContent>
                <CardFooter><Button className="w-full" variant={tier.variant} onClick={() => handleSubscribe(tier.id)} disabled={isCurrent || loading || (isUpgradePlus && tier.id === "plus")}>{isCurrent ? "Current Plan" : tier.cta}</Button></CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50" />}><PricingContent /></Suspense>;
}
