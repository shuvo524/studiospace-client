import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to book studios, manage your listings and track your bookings."
      footer={
        <>
          New to StudioSpace?{" "}
          <Link
            href="/register"
            className="font-semibold text-amber-700 underline-offset-4 hover:underline dark:text-primary"
          >
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-48" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}