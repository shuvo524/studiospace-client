interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-4 text-muted-foreground">{description}</p>
    </div>
  );
}