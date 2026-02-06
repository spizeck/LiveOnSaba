"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Listing } from "@/lib/types";
import {
  Loader2,
  Plus,
  Home,
  Eye,
  MessageSquare,
  Edit,
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  available: {
    label: "Available",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  "coming-soon": {
    label: "Coming Soon",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  "off-market": {
    label: "Off Market",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: XCircle,
  },
};

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

export default function LandlordPortalPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    views: 0,
    inquiries: 0,
  });

  useEffect(() => {
    async function fetchListings() {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "listings"),
          where("landlordId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const listingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];

        setListings(listingsData);

        // Calculate stats
        const total = listingsData.length;
        const active = listingsData.filter((l) => l.status === "available").length;
        const views = listingsData.reduce((sum, l) => sum + (l.viewCount || 0), 0);
        const inquiries = listingsData.reduce(
          (sum, l) => sum + (l.inquiryCount || 0),
          0
        );

        setStats({ total, active, views, inquiries });
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      if (userData?.role !== "landlord" && userData?.role !== "admin") {
        router.push("/landlord/apply");
      } else {
        fetchListings();
      }
    }
  }, [user, userData, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  if (!user || (userData?.role !== "landlord" && userData?.role !== "admin")) {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Landlord Portal
            </h1>
            <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">
              Manage your rental listings
            </p>
          </div>
          <Link
            href="/landlord/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary dark:text-primary-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.total}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Total Listings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.active}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Active Listings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.views}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Total Views
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.inquiries}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Inquiries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Your Listings
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Home className="h-12 w-12 mx-auto text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
              <h3 className="mt-4 text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
                No listings yet
              </h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                Create your first listing to start receiving inquiries.
              </p>
              <Link
                href="/landlord/listings/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Listing
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {listings.map((listing: any) => {
                const statusConfig = STATUS_CONFIG[listing.status] || STATUS_CONFIG.available;
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={listing.id}
                    className="px-6 py-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Thumbnail */}
                      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        {listing.photos?.[listing.primaryPhotoIndex || 0] ? (
                          <img
                            src={listing.photos[listing.primaryPhotoIndex || 0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/listings/${listing.id}`}
                              className="font-semibold text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark line-clamp-1"
                            >
                              {listing.title}
                            </Link>
                            <div className="mt-1 flex items-center gap-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              <MapPin className="h-4 w-4" />
                              {AREAS[listing.area] || listing.area}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                            {formatPrice(listing.monthlyRent)}/mo
                          </span>
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bed`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {listing.bathrooms} bath
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {listing.viewCount || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {listing.inquiryCount || 0} inquiries
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href={`/landlord/listings/${listing.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-primary-light dark:text-text-primary-dark"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                          <Link
                            href={`/listings/${listing.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-primary-light dark:text-text-primary-dark"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
