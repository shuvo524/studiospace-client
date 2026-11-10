"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!looksValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("You are on the list! Watch your inbox for studio news.");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        className="h-11"
      />
      <Button type="submit" size="lg" className="h-11 shrink-0 gap-2">
        <Send className="size-4" />
        <span className="hidden sm:inline">Subscribe</span>
        <span className="sr-only sm:hidden">Subscribe</span>
      </Button>
    </form>
  );
}