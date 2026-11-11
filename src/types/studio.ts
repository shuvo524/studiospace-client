export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export type StudioCategory = (typeof STUDIO_CATEGORIES)[number];

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  cancellationPolicy?: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  hostEmail: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  _id: string;
  studioId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}