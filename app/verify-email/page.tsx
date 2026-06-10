"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/app/_lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (token) {
      authApi
        .verifyEmail(token)
        .then(() => {
          setStatus("success");
          setTimeout(() => router.push("/login"), 2000);
        })
        .catch((err) => {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Verification failed");
        });
    } else {
      setStatus("loading");
    }
  }, [token, router]);

  const handleResend = async () => {
    if (!emailParam) return;
    setResending(true);
    try {
      await authApi.resendVerification(emailParam);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setErrorMessage("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            {status === "loading" && (
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
                <p className="mt-4 text-gray-600">Verifying your email...</p>
              </div>
            )}
            {status === "success" && (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-4 text-lg font-medium text-gray-900">Email verified!</p>
                <p className="mt-2 text-gray-600">Redirecting to login...</p>
              </div>
            )}
            {status === "error" && (
              <div className="text-center">
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <p className="mt-4 text-lg font-medium text-gray-900">Verification failed</p>
                <p className="mt-2 text-gray-600">{errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to{" "}
            <span className="font-medium text-gray-900">{emailParam}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Click the link in the email to verify your account. The link expires in 24 hours.
            </AlertDescription>
          </Alert>
          {resent ? (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">
                Verification email sent! Check your inbox.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend verification email"}
            </Button>
          )}
          <div className="text-center text-sm">
            <Link href="/login" className="text-green-600 hover:underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
