"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Filter,
  X,
  Loader2,
  Home,
} from "lucide-react";
import { Area, Listing } from "@/lib/types";

const AREAS: { value: Area | "all"; label: string }[] = [
  { value: "all", label: "All Areas" },
  { value: "windwardside", label: "Windwardside" },
  { value: "the-bottom", label: "The Bottom" },
  { value: "st-johns", label: "St. John's" },
  { value: "booby-hill", label: "Booby Hill" },
  { value: "the-level", label: "The Level" },
  { value: "upper-hells-gate", label: "Upper Hell's Gate" },
  { value: "lower-hells-gate", label: "Lower Hell's Gate" },
  { value: "english-quarter", label: "English Quarter" },
  { value: "mountain-road", label: "Mountain Road" },
  { value: "wells-bay-road", label: "Wells Bay Road" },
  { value: "troy-hill", label: "Troy Hill" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatArea(area: string): string {
  return AREAS.find((a) => a.value === area)?.label || area;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [area, setArea] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState<string>("");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (area && area !== "all") params.set("area", area);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (minBedrooms) params.set("minBedrooms", minBedrooms);

      const response = await fetch(`/api/listings?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [area, minPrice, maxPrice, minBedrooms]);

  const handleApplyFilters = () => {
    fetchListings();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setArea("all");
    setMinPrice("");
    setMaxPrice("");
    setMinBedrooms("");
  };

  const hasActiveFilters = area !== "all" || minPrice || maxPrice || minBedrooms;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Browse Listings
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            Find your perfect rental on Saba
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            {/* Area Select */}
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="flex-1 sm:flex-none sm:w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
            >
              {AREAS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* More Filters Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-primary dark:bg-primary-dark" />
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-2">
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
                className="w-36 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
              >
                <option value="">Bedrooms</option>
                {BEDROOM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-28 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
              />

              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-28 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="sm:hidden mb-6 p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                Filters
              </span>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Bedrooms
                </label>
                <select
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark"
                >
                  <option value="">Any</option>
                  {BEDROOM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-text-primary-light dark:text-text-primary-dark"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {area !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark rounded-full text-sm">
                {formatArea(area)}
                <button onClick={() => setArea("all")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {minBedrooms && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark rounded-full text-sm">
                {minBedrooms === "0" ? "Studio" : `${minBedrooms}+ beds`}
                <button onClick={() => setMinBedrooms("")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark rounded-full text-sm">
                {minPrice && maxPrice
                  ? `${formatPrice(parseInt(minPrice))} - ${formatPrice(parseInt(maxPrice))}`
                  : minPrice
                  ? `${formatPrice(parseInt(minPrice))}+`
                  : `Up to ${formatPrice(parseInt(maxPrice))}`}
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-text-secondary-light dark:text-text-secondary-dark">
          {loading ? (
            "Searching..."
          ) : (
            <>
              {listings.length} {listings.length === 1 ? "listing" : "listings"} found
            </>
          )}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 mx-auto text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
            <h3 className="mt-4 text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
              No listings found
            </h3>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-4/3 bg-gray-200 dark:bg-gray-700">
                  {listing.photos?.[listing.primaryPhotoIndex || 0] ? (
                    <img
                      src={listing.photos[listing.primaryPhotoIndex || 0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {listing.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-accent dark:bg-accent-dark text-white text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold rounded">
                    {formatPrice(listing.monthlyRent)}/mo
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark line-clamp-1 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                    {listing.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                    <MapPin className="h-4 w-4" />
                    {formatArea(listing.area)}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-text-secondary-light dark:text-text-secondary-dark text-sm">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bed`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {listing.bathrooms} bath
                    </span>
                    {listing.squareFootage && (
                      <span>{listing.squareFootage} sq ft</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
