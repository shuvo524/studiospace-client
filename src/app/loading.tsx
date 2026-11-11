import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Aperture className="size-12 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading StudioSpace...</p>
    </div>
  );
}