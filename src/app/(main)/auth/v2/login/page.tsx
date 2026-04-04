import { Suspense } from "react";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { SmokeyBackground } from "@/components/ui/login-form";
import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default function LoginV2() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-stone-950">
      <SmokeyBackground color="#ffffff" backdropBlurAmount="md" />

      <div className="relative z-10 mx-auto flex w-full max-w-[430px] flex-col justify-center space-y-8 rounded-2xl border border-white/40 bg-black/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-lg">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl text-white">Welcome back</h1>
          <p className="text-gray-300 text-sm">Sign in to your family&apos;s recipe book.</p>
        </div>
        <div className="space-y-4">
          <GoogleButton className="w-full border border-white/30 bg-white/95 text-stone-800 hover:bg-white" />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-transparent px-2 text-gray-300">Or continue with</span>
          </div>
          <Suspense fallback={<div className="h-44 rounded-md border border-border/60 bg-muted/30" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <div className="absolute top-5 left-0 flex w-full items-center justify-between px-10">
        <Link
          prefetch={false}
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-white/90 text-sm backdrop-blur-md transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-white/90 text-sm backdrop-blur-md">
          Don&apos;t have an account?{" "}
          <Link prefetch={false} className="text-white" href="/auth/v2/register">
            Register
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-center px-10">
        <div className="text-white/80 text-sm">{APP_CONFIG.copyright}</div>
      </div>
    </div>
  );
}
