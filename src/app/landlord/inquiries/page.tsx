"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Loader2,
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  replied: {
    label: "Replied",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: XCircle,
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InquiriesPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "replied" | "closed">("all");

  useEffect(() => {
    async function fetchInquiries() {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "inquiries"),
          where("landlordId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const inquiriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        }));

        setInquiries(inquiriesData);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      if (userData?.role !== "landlord" && userData?.role !== "admin") {
        router.push("/landlord/apply");
      } else {
        fetchInquiries();
      }
    }
  }, [user, userData, authLoading, router]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), {
        status,
        updatedAt: new Date(),
      });

      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
        )
      );
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) =>
    filter === "all" ? true : inquiry.status === filter
  );

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Inquiries
          </h1>
          <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">
            Manage inquiries from potential tenants
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(["all", "pending", "replied", "closed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-primary dark:bg-primary-dark text-white"
                  : "bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark hover:bg-background-light dark:hover:bg-background-dark"
              }`}
            >
              {status === "all" && "All"}
              {status === "pending" && "Pending"}
              {status === "replied" && "Replied"}
              {status === "closed" && "Closed"}
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
            <h3 className="mt-4 text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
              {filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
            </h3>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              {filter === "all"
                ? "Inquiries from potential tenants will appear here."
                : `No inquiries with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => {
              const statusConfig = STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={inquiry.id}
                  className="bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Inquiry Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                            {inquiry.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {inquiry.email}
                            </span>
                            {inquiry.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {inquiry.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(inquiry.createdAt)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                          Regarding:{" "}
                          <Link
                            href={`/listings/${inquiry.listingId}`}
                            className="font-medium text-primary dark:text-primary-dark hover:underline"
                          >
                            {inquiry.listingTitle || inquiry.listingId}
                          </Link>
                        </p>
                      </div>

                      <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                        <p className="text-text-primary-light dark:text-text-primary-dark whitespace-pre-line">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-4">
                      <Link
                        href={`mailto:${inquiry.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-primary-light dark:text-text-primary-dark"
                      >
                        <Mail className="h-4 w-4" />
                        Reply
                      </Link>

                      {inquiry.status === "pending" && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, "replied")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-primary-light dark:text-text-primary-dark"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Replied
                        </button>
                      )}

                      {inquiry.status === "replied" && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, "closed")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-primary-light dark:text-text-primary-dark"
                        >
                          <XCircle className="h-4 w-4" />
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
