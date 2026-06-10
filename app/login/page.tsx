"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);

    try {
      const user = await authApi.login(email, password);
      await refresh();
      router.push(user.has_completed_onboarding ? "/dashboard" : "/onboarding");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      if (message === "email_not_verified") {
        setUnverified(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setError("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your CycleEats account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {unverified && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-800">
                  Please verify your email. Check your inbox for a verification link.
                  {resent ? (
                    <span className="ml-2 text-green-600">Email sent!</span>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-amber-800 underline"
                      onClick={handleResend}
                      disabled={resending}
                    >
                      {resending ? "Sending..." : "Resend verification email"}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
