export function StudioCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] w-full bg-muted" />
      <div className="flex flex-1 flex-col p-5">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="h-6 w-20 rounded bg-muted" />
          <div className="h-8 w-28 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}