"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Car,
  Dog,
  Users,
  Zap,
  Droplets,
  Wifi,
  Star,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  Check,
  X as XIcon,
} from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";

const AREAS: Record<string, string> = {
  windwardside: "Windwardside",
  "the-bottom": "The Bottom",
  "st-johns": "St. John's",
  "booby-hill": "Booby Hill",
  "the-level": "The Level",
  "upper-hells-gate": "Upper Hell's Gate",
  "lower-hells-gate": "Lower Hell's Gate",
  "english-quarter": "English Quarter",
  "mountain-road": "Mountain Road",
  "wells-bay-road": "Wells Bay Road",
  "troy-hill": "Troy Hill",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Immediately";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Listing not found");
          return;
        }

        setListing(data.listing);
        setCurrentPhotoIndex(data.listing.primaryPhotoIndex || 0);
      } catch (err) {
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const nextPhoto = () => {
    if (listing?.photos?.length > 1) {
      setCurrentPhotoIndex((prev) =>
        prev === listing.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (listing?.photos?.length > 1) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? listing.photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
        <div className="text-center">
          <Home className="h-12 w-12 mx-auto text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
          <h1 className="mt-4 text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            {error || "Listing not found"}
          </h1>
          <Link
            href="/listings"
            className="mt-4 inline-flex items-center gap-2 text-primary dark:text-primary-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {listing.photos?.length > 0 ? (
                <>
                  <img
                    src={listing.photos[currentPhotoIndex]}
                    alt={`${listing.title} - Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {listing.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6 text-text-primary-light dark:text-text-primary-dark" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors"
                      >
                        <ChevronRight className="h-6 w-6 text-text-primary-light dark:text-text-primary-dark" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {listing.photos.map((_: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentPhotoIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {listing.featured && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-accent dark:bg-accent-dark text-white text-sm font-medium rounded">
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {listing.photos?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.photos.map((photo: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentPhotoIndex
                        ? "border-primary dark:border-primary-dark"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {listing.title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <MapPin className="h-5 w-5" />
                <span>{listing.address}</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{AREAS[listing.area] || listing.area}</span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <Bed className="h-5 w-5 text-primary dark:text-primary-dark mb-2" />
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Bedrooms
                </p>
                <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}
                </p>
              </div>
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <Bath className="h-5 w-5 text-primary dark:text-primary-dark mb-2" />
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Bathrooms
                </p>
                <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {listing.bathrooms}
                </p>
              </div>
              {listing.squareFootage && (
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <Square className="h-5 w-5 text-primary dark:text-primary-dark mb-2" />
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Size
                  </p>
                  <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {listing.squareFootage} sq ft
                  </p>
                </div>
              )}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <Calendar className="h-5 w-5 text-primary dark:text-primary-dark mb-2" />
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Available
                </p>
                <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {formatDate(listing.availableFrom)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Description
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Features & Policies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 dark:bg-primary-dark/10 rounded-lg">
                    <Home className="h-5 w-5 text-primary dark:text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Furnished
                    </p>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                      {listing.furnished === "yes"
                        ? "Fully Furnished"
                        : listing.furnished === "partial"
                        ? "Partially Furnished"
                        : "Unfurnished"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 dark:bg-primary-dark/10 rounded-lg">
                    <Dog className="h-5 w-5 text-primary dark:text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Pets
                    </p>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                      {listing.petsAllowed === "yes"
                        ? "Allowed"
                        : listing.petsAllowed === "negotiable"
                        ? "Negotiable"
                        : "Not Allowed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 dark:bg-primary-dark/10 rounded-lg">
                    <Car className="h-5 w-5 text-primary dark:text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Parking
                    </p>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                      {listing.parking === "on-property"
                        ? "On Property"
                        : "Street Parking"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 dark:bg-primary-dark/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary dark:text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Second Occupant
                    </p>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                      {listing.secondOccupant === "allowed"
                        ? "Allowed"
                        : listing.secondOccupant === "additional-fee"
                        ? "Additional Fee"
                        : "Not Allowed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Utilities */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Utilities
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      Electric
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {listing.utilities?.electric === "yes" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : listing.utilities?.electric === "partial" ? (
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">
                        Partial
                      </span>
                    ) : (
                      <XIcon className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {listing.utilities?.electric === "yes"
                        ? "Included"
                        : listing.utilities?.electric === "partial"
                        ? listing.utilities?.electricAllowance || "Partial"
                        : "Not Included"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      Water
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {listing.utilities?.water === "yes" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <XIcon className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {listing.utilities?.water === "yes"
                        ? "Included"
                        : "Not Included"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-purple-500" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      Internet
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {listing.utilities?.internet === "yes" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <XIcon className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {listing.utilities?.internet === "yes"
                        ? "Included"
                        : "Not Included"}
                    </span>
                  </div>
                </div>

                {listing.utilities?.otherDetails && (
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {listing.utilities.otherDetails}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {formatPrice(listing.monthlyRent)}
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  per month
                </p>
              </div>

              {/* Landlord Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Listed by
                </p>
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {listing.landlord?.displayName}
                </p>
                {listing.landlord?.averageRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                      {listing.landlord.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      ({listing.landlord.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              {(listing.landlord?.contactEmail || listing.landlord?.contactPhone) && (
                <div className="space-y-3 mb-6">
                  {listing.landlord?.contactEmail && (
                    <a
                      href={`mailto:${listing.landlord.contactEmail}`}
                      className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark"
                    >
                      <Mail className="h-4 w-4" />
                      {listing.landlord.contactEmail}
                    </a>
                  )}
                  {listing.landlord?.contactPhone && (
                    <a
                      href={`tel:${listing.landlord.contactPhone}`}
                      className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark"
                    >
                      <Phone className="h-4 w-4" />
                      {listing.landlord.contactPhone}
                    </a>
                  )}
                </div>
              )}

              {/* Inquiry Form */}
              {listing.contactFormEnabled && !inquirySent && (
                <InquiryForm
                  listingId={listing.id}
                  listingTitle={listing.title}
                  onSuccess={() => setInquirySent(true)}
                />
              )}

              <p className="mt-4 text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
                {listing.viewCount} views • {listing.inquiryCount} inquiries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
