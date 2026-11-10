import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join StudioSpace to book creative studios or list your own space."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-amber-700 underline-offset-4 hover:underline dark:text-primary"
          >
            Login
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <RegisterForm />
        <Suspense fallback={<div className="h-24" />}>
          <GoogleButton />
        </Suspense>
      </div>
    </AuthCard>
  );
}