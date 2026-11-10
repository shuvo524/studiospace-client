"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type FieldErrors = {
  name?: string;
  email?: string;
  photo?: string;
  password?: string;
};

function checkPassword(password: string) {
  return {
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    length: password.length >= 6,
  };
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const rules = checkPassword(password);

  const ruleList = [
    { ok: rules.upper, text: "At least one uppercase letter" },
    { ok: rules.lower, text: "At least one lowercase letter" },
    { ok: rules.length, text: "At least 6 characters" },
  ];

  const validate = () => {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (photo.trim() && !isValidUrl(photo.trim())) {
      next.photo = "Photo URL must start with http:// or https://";
    }
    if (!rules.upper) {
      next.password = "Password must contain an uppercase letter.";
    } else if (!rules.lower) {
      next.password = "Password must contain a lowercase letter.";
    } else if (!rules.length) {
      next.password = "Password must be at least 6 characters long.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photo.trim() || undefined,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created! Please log in to continue.");
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          className="h-11"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="h-11"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo URL</Label>
        <Input
          id="photo"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://example.com/your-photo.jpg"
          autoComplete="off"
          aria-invalid={!!errors.photo}
          className="h-11"
        />
        {errors.photo && (
          <p className="text-sm text-destructive">{errors.photo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className="h-11 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
        <ul className="space-y-1 pt-1">
          {ruleList.map((rule) => (
            <li
              key={rule.text}
              className={`flex items-center gap-2 text-xs ${
                rule.ok
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {rule.ok ? (
                <Check className="size-3.5" />
              ) : (
                <X className="size-3.5" />
              )}
              {rule.text}
            </li>
          ))}
        </ul>
      </div>

      <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Register"
        )}
      </Button>

      <p className="sr-only">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </form>
  );
}