"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Landlord } from "@/lib/types";
import {
  Mail,
  Phone,
  FileText,
  Loader2,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type ApplicationStatus = "loading" | "not-applied" | "pending" | "approved";

export default function LandlordApplyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<ApplicationStatus>("loading");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [showContactPublicly, setShowContactPublicly] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkExistingApplication() {
      if (!user?.uid) return;

      try {
        const landlordDoc = await getDoc(doc(db, "landlords", user.uid));
        if (landlordDoc.exists()) {
          const data = landlordDoc.data() as Landlord;
          if (data.approved) {
            setStatus("approved");
          } else {
            setStatus("pending");
          }
        } else {
          setStatus("not-applied");
          setContactEmail(user.email || "");
        }
      } catch (err) {
        console.error("Error checking application:", err);
        setStatus("not-applied");
        setContactEmail(user.email || "");
      }
    }

    if (!authLoading && user) {
      checkExistingApplication();
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/landlords/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactEmail,
          contactPhone: contactPhone || undefined,
          profileDescription: profileDescription || undefined,
          showContactPublicly,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setStatus("pending");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || status === "loading") {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Sign In Required
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            You need to sign in before applying to become a landlord.
          </p>
          <Link
            href="/signin?redirect=/landlord/apply"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            You&apos;re Already Approved!
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            Visit your landlord dashboard to manage your listings.
          </p>
          <Link
            href="/landlord"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 bg-background-light dark:bg-background-dark">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Application Pending
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            Your landlord application is under review. We&apos;ll notify you by
            email once it&apos;s been processed.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-primary dark:text-primary-dark hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)] py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Become a Landlord
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            Apply to list your rental properties on LiveOnSaba
          </p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2"
              >
                Contact Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none transition-colors"
                  placeholder="landlord@example.com"
                />
              </div>
              <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                This email will be used for inquiries from potential tenants
              </p>
            </div>

            <div>
              <label
                htmlFor="contactPhone"
                className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2"
              >
                Contact Phone{" "}
                <span className="text-text-secondary-light dark:text-text-secondary-dark font-normal">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
                <input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none transition-colors"
                  placeholder="+599 416 1234"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profileDescription"
                className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2"
              >
                About You{" "}
                <span className="text-text-secondary-light dark:text-text-secondary-dark font-normal">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
                <textarea
                  id="profileDescription"
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Tell potential tenants a bit about yourself..."
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="showContactPublicly"
                type="checkbox"
                checked={showContactPublicly}
                onChange={(e) => setShowContactPublicly(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
              />
              <label
                htmlFor="showContactPublicly"
                className="text-sm text-text-primary-light dark:text-text-primary-dark"
              >
                Display my contact information publicly on my listings
                <span className="block text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  If unchecked, tenants can still reach you via the contact form
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Applications are typically reviewed within 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
