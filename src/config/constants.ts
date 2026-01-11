import { Area, ListingStatus } from "@/lib/types";

export const AREAS: { value: Area; label: string }[] = [
  { value: "windwardside", label: "Windwardside" },
  { value: "st-johns", label: "St. Johns" },
  { value: "the-bottom", label: "The Bottom" },
  { value: "booby-hill", label: "Booby Hill" },
  { value: "the-level", label: "The Level" },
  { value: "upper-hells-gate", label: "Upper Hell's Gate" },
  { value: "lower-hells-gate", label: "Lower Hell's Gate" },
  { value: "english-quarter", label: "English Quarter" },
  { value: "mountain-road", label: "Mountain Road" },
  { value: "wells-bay-road", label: "Wells Bay Road" },
  { value: "troy-hill", label: "Troy Hill" },
];

export const LISTING_STATUSES: { value: ListingStatus; label: string }[] = [
  { value: "coming-soon", label: "Coming Soon" },
  { value: "available", label: "Available" },
  { value: "pending", label: "Pending" },
  { value: "off-market", label: "Off Market" },
];

export const BEDROOM_OPTIONS = [
  { value: 0, label: "Studio" },
  { value: 1, label: "1 Bedroom" },
  { value: 2, label: "2 Bedrooms" },
  { value: 3, label: "3 Bedrooms" },
  { value: 4, label: "4+ Bedrooms" },
];

export const BATHROOM_OPTIONS = [
  { value: 1, label: "1 Bathroom" },
  { value: 1.5, label: "1.5 Bathrooms" },
  { value: 2, label: "2 Bathrooms" },
  { value: 2.5, label: "2.5 Bathrooms" },
  { value: 3, label: "3+ Bathrooms" },
];

export const MAX_PHOTOS_PER_LISTING = 10;
export const MAX_PHOTO_SIZE_MB = 5;
export const MAX_VERIFICATION_DOC_SIZE_MB = 10;

export const SITE_NAME = "LiveOnSaba";
export const SITE_DESCRIPTION = "Find your home on Saba - Browse rental properties in the Dutch Caribbean";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://liveonsaba.com";
