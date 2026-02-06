import { Timestamp, GeoPoint } from "firebase/firestore";

export type Area =
  | "windwardside"
  | "st-johns"
  | "the-bottom"
  | "booby-hill"
  | "the-level"
  | "upper-hells-gate"
  | "lower-hells-gate"
  | "english-quarter"
  | "mountain-road"
  | "wells-bay-road"
  | "troy-hill";

export type ListingStatus = "coming-soon" | "available" | "pending" | "off-market";

export type FurnishedStatus = "yes" | "partial" | "no";
export type PetPolicy = "yes" | "no" | "negotiable";
export type ParkingType = "on-property" | "street";
export type OccupantPolicy = "allowed" | "additional-fee" | "not-allowed";
export type UtilityIncluded = "yes" | "partial" | "no";

export interface ListingFilters {
  areas?: Area[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  petsAllowed?: boolean;
  parkingType?: ParkingType;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: ListingFilters;
  createdAt: Timestamp;
  alertEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "user" | "landlord" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isVerifiedTenant: boolean;
  tenantVerificationDoc?: string;
  tenantVerifiedAt?: Timestamp;
  tenantVerifiedBy?: string;
  savedListings: string[];
  savedSearches: SavedSearch[];
  emailNotifications: boolean;
  notificationFrequency: "instant" | "daily" | "weekly";
}

export interface Landlord {
  id: string;
  userId: string;
  approved: boolean;
  approvedAt?: Timestamp;
  approvedBy?: string;
  suspended?: boolean;
  suspendedAt?: Timestamp;
  suspendedBy?: string;
  applicationDate: Timestamp;
  profileDescription?: string;
  profilePhoto?: string;
  contactEmail: string;
  contactPhone?: string;
  showContactPublicly: boolean;
  totalListings: number;
  activeListings: number;
  averageRating?: number;
  reviewCount: number;
}

export interface Listing {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  monthlyRent: number;
  area: Area;
  address: string;
  location: GeoPoint;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  status: ListingStatus;
  availableFrom?: Timestamp;
  furnished: FurnishedStatus;
  petsAllowed: PetPolicy;
  parking: ParkingType;
  secondOccupant: OccupantPolicy;
  utilities: {
    electric: UtilityIncluded;
    electricAllowance?: string;
    water: UtilityIncluded;
    waterDetails?: string;
    internet: UtilityIncluded;
    otherDetails?: string;
  };
  photos: string[];
  primaryPhotoIndex: number;
  contactFormEnabled: boolean;
  showContactInfo: boolean;
  lastVerifiedAt: Timestamp;
  verificationEmailSentAt?: Timestamp;
  featured: boolean;
  viewCount: number;
  inquiryCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  listingId: string;
  landlordId: string;
  reviewerId: string;
  ratings: {
    location: number;
    quality: number;
    upkeep: number;
    communication: number;
    accuracy: number;
  };
  overallRating: number;
  writtenReview: string;
  status: "pending" | "approved" | "rejected";
  moderatedAt?: Timestamp;
  moderatedBy?: string;
  rejectionReason?: string;
  createdAt: Timestamp;
}

export interface Inquiry {
  id: string;
  listingId: string;
  landlordId: string;
  userId?: string; // null for unauthenticated users
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "pending" | "replied" | "closed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AdminActionType =
  | "landlord-approved"
  | "landlord-rejected"
  | "tenant-verified"
  | "review-approved"
  | "review-rejected"
  | "listing-featured"
  | "listing-edited"
  | "user-edited";
