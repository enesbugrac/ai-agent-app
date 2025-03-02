"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/terminal");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="logo-background w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <span className="logo-content text-primary text-4xl font-medium">A</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to <span className="text-primary">Aigen</span>
          </h2>
          <p className="text-secondary text-sm">
            Connect your wallet or sign in with email to continue
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => login()}
            className="w-full bg-primary text-background font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <span>Connect Wallet</span>
          </button>
        </div>

        <div className="text-center text-muted text-xs">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
