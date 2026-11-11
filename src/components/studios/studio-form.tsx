"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api, ApiError } from "@/lib/api";
import { syncBackendToken } from "@/lib/backend-token";
import { cn } from "@/lib/utils";
import { STUDIO_CATEGORIES } from "@/types/studio";

export interface StudioFormValues {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}

const emptyValues: StudioFormValues = {
  title: "",
  category: STUDIO_CATEGORIES[0],
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  amenities: [],
  overview: "",
};

const SUGGESTED_AMENITIES = [
  "Wi-Fi",
  "Air conditioning",
  "Lighting kit",
  "Cyc wall",
  "Green screen",
  "Soundproofing",
  "Microphones",
  "Mixing console",
  "Backdrops",
  "Props",
  "Makeup room",
  "Parking",
  "Kitchenette",
  "Restroom",
];

interface StudioFormProps {
  mode: "add" | "edit";
  studioId?: string;
  initialValues?: StudioFormValues;
}

type FormErrors = Partial<Record<keyof StudioFormValues, string>>;

export function StudioForm({
  mode,
  studioId,
  initialValues,
}: StudioFormProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const fileInput = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<StudioFormValues>(
    initialValues ?? emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [customAmenity, setCustomAmenity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof StudioFormValues>(
    key: K,
    value: StudioFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleAmenity(name: string) {
    setField(
      "amenities",
      values.amenities.includes(name)
        ? values.amenities.filter((item) => item !== name)
        : [...values.amenities, name],
    );
  }

  function addCustomAmenity() {
    const name = customAmenity.trim();
    if (!name) return;
    if (!values.amenities.some((a) => a.toLowerCase() === name.toLowerCase())) {
      setField("amenities", [...values.amenities, name]);
    }
    setCustomAmenity("");
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
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
      setField("imageUrl", data.url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (values.title.trim().length < 3) {
      next.title = "Title must be at least 3 characters.";
    }
    if (!values.category) {
      next.category = "Please choose a category.";
    }
    if (!(Number(values.hourlyRate) > 0)) {
      next.hourlyRate = "Enter an hourly rate greater than 0.";
    }
    if (values.securityDeposit && !(Number(values.securityDeposit) >= 0)) {
      next.securityDeposit = "Security deposit cannot be negative.";
    }
    if (!Number.isInteger(Number(values.maxCapacity)) || Number(values.maxCapacity) < 1) {
      next.maxCapacity = "Enter a whole number of 1 or more.";
    }
    if (values.location.trim().length < 3) {
      next.location = "Please enter the studio location.";
    }
    try {
      const url = new URL(values.imageUrl.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("bad protocol");
      }
    } catch {
      next.imageUrl = "Upload an image or paste a valid image link.";
    }
    if (values.overview.trim().length < 20) {
      next.overview = "Overview must be at least 20 characters.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      title: values.title.trim(),
      category: values.category,
      hourlyRate: Number(values.hourlyRate),
      securityDeposit: Number(values.securityDeposit) || 0,
      maxCapacity: Number(values.maxCapacity),
      location: values.location.trim(),
      imageUrl: values.imageUrl.trim(),
      amenities: values.amenities,
      overview: values.overview.trim(),
    };

    async function save() {
      if (mode === "edit" && studioId) {
        await api(`/api/studios/${studioId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/studios", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    }

    setSubmitting(true);
    try {
      try {
        await save();
      } catch (error) {
        // The secure cookie may be missing even though the user is logged in.
        // Ask for a fresh one and try once more.
        if (
          error instanceof ApiError &&
          error.status === 401 &&
          (await syncBackendToken())
        ) {
          await save();
        } else {
          throw error;
        }
      }

      toast.success(
        mode === "edit"
          ? "Studio updated successfully."
          : "Studio added successfully.",
      );
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  const showImage = values.imageUrl.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
    >
      {/* Basic details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Studio title</Label>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="e.g. Golden Hour Photo Studio"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={values.category}
            onValueChange={(value) =>
              setField("category", value ?? STUDIO_CATEGORIES[0])
            }
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {STUDIO_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location / address</Label>
          <Input
            id="location"
            value={values.location}
            onChange={(e) => setField("location", e.target.value)}
            placeholder="e.g. Gulshan 2, Dhaka"
            aria-invalid={Boolean(errors.location)}
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            value={values.hourlyRate}
            onChange={(e) => setField("hourlyRate", e.target.value)}
            placeholder="45"
            aria-invalid={Boolean(errors.hourlyRate)}
          />
          {errors.hourlyRate && (
            <p className="text-sm text-destructive">{errors.hourlyRate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="securityDeposit">Security deposit ($)</Label>
          <Input
            id="securityDeposit"
            type="number"
            min="0"
            step="0.01"
            value={values.securityDeposit}
            onChange={(e) => setField("securityDeposit", e.target.value)}
            placeholder="100"
            aria-invalid={Boolean(errors.securityDeposit)}
          />
          {errors.securityDeposit && (
            <p className="text-sm text-destructive">
              {errors.securityDeposit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Max capacity (people)</Label>
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            step="1"
            value={values.maxCapacity}
            onChange={(e) => setField("maxCapacity", e.target.value)}
            placeholder="10"
            aria-invalid={Boolean(errors.maxCapacity)}
          />
          {errors.maxCapacity && (
            <p className="text-sm text-destructive">{errors.maxCapacity}</p>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="space-y-3">
        <Label htmlFor="imageUrl">Studio image</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="imageUrl"
            value={values.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
            placeholder="Paste an image link, or upload a file"
            aria-invalid={Boolean(errors.imageUrl)}
          />
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="gap-2 sm:shrink-0"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>
        {errors.imageUrl && (
          <p className="text-sm text-destructive">{errors.imageUrl}</p>
        )}
        {showImage && (
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            <img
              src={values.imageUrl}
              alt="Studio preview"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_AMENITIES.map((name) => {
            const active = values.amenities.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => toggleAmenity(name)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary",
                )}
              >
                {name}
              </button>
            );
          })}
          {values.amenities
            .filter((name) => !SUGGESTED_AMENITIES.includes(name))
            .map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleAmenity(name)}
                className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              >
                {name}
                <X className="size-3" />
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add your own amenity"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCustomAmenity}
            className="gap-1"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="space-y-2">
        <Label htmlFor="overview">Detailed overview</Label>
        <Textarea
          id="overview"
          rows={6}
          value={values.overview}
          onChange={(e) => setField("overview", e.target.value)}
          placeholder="Describe the space, the equipment, house rules and what makes it special."
          aria-invalid={Boolean(errors.overview)}
        />
        {errors.overview && (
          <p className="text-sm text-destructive">{errors.overview}</p>
        )}
      </div>

      {/* Host info (read-only) */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hostName">Host name</Label>
          <Input id="hostName" value={user?.name ?? ""} readOnly disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hostEmail">Host email</Label>
          <Input id="hostEmail" value={user?.email ?? ""} readOnly disabled />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || uploading} className="gap-2">
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {mode === "edit" ? "Save changes" : "Add studio"}
        </Button>
      </div>
    </form>
  );
}