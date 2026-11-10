import { Aperture } from "lucide-react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="spotlight-glow absolute inset-x-0 top-0 -z-10 h-[420px]" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Aperture className="size-6" strokeWidth={2.2} />
            </span>
            <h1 className="section-title">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </div>
          {children}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      </div>
    </section>
  );
}