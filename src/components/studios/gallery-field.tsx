"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_IMAGES = 5;

interface GalleryFieldProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function GalleryField({ value, onChange }: GalleryFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const remaining = MAX_IMAGES - value.length;

  function addLink() {
    const trimmed = link.trim();
    if (!trimmed) return;

    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("bad protocol");
      }
    } catch {
      toast.error("Please paste a valid image link.");
      return;
    }

    if (value.includes(trimmed)) {
      toast.error("This image is already in the gallery.");
      return;
    }
    if (remaining <= 0) {
      toast.error(`You can add up to ${MAX_IMAGES} extra photos.`);
      return;
    }

    onChange([...value, trimmed]);
    setLink("");
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, remaining);
    event.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      try {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = (await response.json()) as {
          url?: string;
          message?: string;
        };
        if (!response.ok || !data.url) {
          throw new Error(data.message || "Image upload failed.");
        }
        uploaded.push(data.url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Image upload failed.",
        );
      }
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
      toast.success(
        uploaded.length === 1
          ? "Photo uploaded successfully."
          : `${uploaded.length} photos uploaded successfully.`,
      );
    }
    setUploading(false);
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>More photos (optional)</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Add up to {MAX_IMAGES} extra photos. They appear in the gallery on
          your studio page.
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img
                src={src}
                alt={`Gallery photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addLink();
                }
              }}
              placeholder="Paste an image link"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addLink}
              className="gap-1 sm:shrink-0"
            >
              <Plus className="size-4" />
              Add link
            </Button>
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="gap-2"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? "Uploading..." : "Upload photos"}
          </Button>
        </div>
      )}
    </div>
  );
}