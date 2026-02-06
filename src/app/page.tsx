import Link from "next/link";
import { ArrowRight, Home, MapPin, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-accent/10 dark:from-primary-dark/10 dark:to-accent-dark/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-6xl">
              Find Your Home on Saba
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
              Discover rental properties in the Dutch Caribbean&apos;s hidden gem. Browse listings,
              connect with landlords, and find your perfect island home.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/listings"
                className="rounded-lg bg-primary dark:bg-primary-dark px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors flex items-center gap-2"
              >
                Browse Listings
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/landlord/apply"
                className="text-base font-semibold leading-7 text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
              >
                List Your Property <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-4xl">
              Why Choose LiveOnSaba?
            </h2>
            <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
              The trusted platform for finding rental properties on Saba
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary-dark/10">
                <Home className="h-6 w-6 text-primary dark:text-primary-dark" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Comprehensive Listings
              </h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                Browse all available rental properties on Saba in one place. Filter by area,
                price, bedrooms, and more.
              </p>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary-dark/10">
                <MapPin className="h-6 w-6 text-primary dark:text-primary-dark" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Local Focus
              </h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                Built specifically for Saba&apos;s unique rental market. Search by village and
                discover properties across the island.
              </p>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary-dark/10">
                <Shield className="h-6 w-6 text-primary dark:text-primary-dark" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Verified Landlords
              </h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                All landlords are verified before listing. Read reviews from verified tenants to
                make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-surface-light dark:bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark sm:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
              Coming soon - Check back for featured properties
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 text-primary dark:text-primary-dark hover:underline font-semibold"
            >
              View All Listings
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-primary dark:bg-primary-dark rounded-2xl px-6 py-16 sm:p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to List Your Property?
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
              Join our community of verified landlords and connect with quality tenants looking
              for their next home on Saba.
            </p>
            <div className="mt-10">
              <Link
                href="/landlord/apply"
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                Apply as a Landlord
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
