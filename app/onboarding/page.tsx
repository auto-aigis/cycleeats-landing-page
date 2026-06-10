"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { onboardingApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import {
  SYMPTOM_OPTIONS,
  DIETARY_OPTIONS,
  CYCLE_PHASE_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  type PCOSProfile,
} from "@/app/_lib/types";
import { Loader2, Heart } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Partial<PCOSProfile>>({
    symptoms: [],
    dietary_exclusions: [],
    cycle_phase: "",
    primary_goal: "",
  });

  useEffect(() => {
    if (user?.has_completed_onboarding) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const handleSymptomToggle = (symptom: string) => {
    setProfile((prev) => ({
      ...prev,
      symptoms: prev.symptoms?.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...(prev.symptoms || []), symptom],
    }));
  };

  const handleDietaryToggle = (diet: string) => {
    setProfile((prev) => ({
      ...prev,
      dietary_exclusions: prev.dietary_exclusions?.includes(diet)
        ? prev.dietary_exclusions.filter((d) => d !== diet)
        : [...(prev.dietary_exclusions || []), diet],
    }));
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError("");
      try {
        await onboardingApi.save({
          symptoms: profile.symptoms || [],
          dietary_exclusions: profile.dietary_exclusions || [],
          cycle_phase: profile.cycle_phase || "I don't track",
          primary_goal: profile.primary_goal || "general PCOS nutrition",
        });
        await refresh();
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save profile");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Let&apos;s get to know you</h1>
          <p className="mt-2 text-gray-600">
            This helps us personalize your PCOS nutrition plan
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-colors ${
                s <= step ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "What symptoms do you experience?"}
              {step === 2 && "Any dietary preferences or exclusions?"}
              {step === 3 && "What's your main goal?"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Select all that apply (optional)"}
              {step === 2 && "Select all that apply"}
              {step === 3 && "Choose the most important one for you"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-3">
                {SYMPTOM_OPTIONS.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-3">
                    <Checkbox
                      id={symptom}
                      checked={profile.symptoms?.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label htmlFor={symptom} className="cursor-pointer font-normal">
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {DIETARY_OPTIONS.map((diet) => (
                  <div key={diet} className="flex items-center space-x-3">
                    <Checkbox
                      id={diet}
                      checked={profile.dietary_exclusions?.includes(diet)}
                      onCheckedChange={() => handleDietaryToggle(diet)}
                    />
                    <Label htmlFor={diet} className="cursor-pointer font-normal">
                      {diet}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Current cycle phase</Label>
                  <RadioGroup
                    value={profile.cycle_phase}
                    onValueChange={(val) => setProfile((prev) => ({ ...prev, cycle_phase: val }))}
                    className="flex flex-wrap gap-3"
                  >
                    {CYCLE_PHASE_OPTIONS.map((phase) => (
                      <div key={phase} className="flex items-center">
                        <RadioGroupItem value={phase} id={phase} className="peer sr-only" />
                        <Label
                          htmlFor={phase}
                          className="cursor-pointer rounded-full border border-gray-200 px-3 py-1.5 text-sm peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700"
                        >
                          {phase}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Primary goal</Label>
                  <RadioGroup
                    value={profile.primary_goal}
                    onValueChange={(val) => setProfile((prev) => ({ ...prev, primary_goal: val }))}
                    className="space-y-2"
                  >
                    {PRIMARY_GOAL_OPTIONS.map((goal) => (
                      <div key={goal} className="flex items-center space-x-3">
                        <RadioGroupItem value={goal} id={goal} />
                        <Label htmlFor={goal} className="cursor-pointer font-normal">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={loading} className="ml-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 3 ? "Complete" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}