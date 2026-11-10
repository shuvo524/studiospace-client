import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
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
      <RegisterForm />
    </AuthCard>
  );
}