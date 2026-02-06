"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Heart, Search, Settings, Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark" />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Welcome back, {user?.displayName || user?.email?.split("@")[0]}!
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            Manage your saved listings and searches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<Heart className="h-6 w-6" />}
            title="Saved Listings"
            count={userData?.savedListings?.length || 0}
            href="/dashboard/saved"
          />
          <DashboardCard
            icon={<Search className="h-6 w-6" />}
            title="Saved Searches"
            count={userData?.savedSearches?.length || 0}
            href="/dashboard/searches"
          />
          <DashboardCard
            icon={<Bell className="h-6 w-6" />}
            title="Notifications"
            description={userData?.emailNotifications ? "Enabled" : "Disabled"}
            href="/dashboard/settings"
          />
          <DashboardCard
            icon={<Settings className="h-6 w-6" />}
            title="Settings"
            description="Account preferences"
            href="/dashboard/settings"
          />
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
            >
              Browse Listings
            </Link>
            {userData?.role === "user" && (
              <Link
                href="/landlord/apply"
                className="px-4 py-2 border border-primary dark:border-primary-dark text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-colors"
              >
                Apply as Landlord
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  count,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  description?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-primary dark:hover:border-primary-dark transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center text-primary dark:text-primary-dark">
          {icon}
        </div>
        <div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {title}
          </p>
          {count !== undefined ? (
            <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {count}
            </p>
          ) : (
            <p className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
