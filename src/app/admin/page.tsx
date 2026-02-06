"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Landlord, User } from "@/lib/types";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Users,
  Home,
  Shield,
  Ban,
  RotateCcw,
} from "lucide-react";

interface LandlordApplication extends Landlord {
  userName?: string;
  userEmail?: string;
}

type TabType = "pending" | "active" | "suspended";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [pendingLandlords, setPendingLandlords] = useState<LandlordApplication[]>([]);
  const [activeLandlords, setActiveLandlords] = useState<LandlordApplication[]>([]);
  const [suspendedLandlords, setSuspendedLandlords] = useState<LandlordApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchLandlords = async () => {
    if (!user || user.role !== "admin") return;

    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "landlords"));
      
      const pending: LandlordApplication[] = [];
      const active: LandlordApplication[] = [];
      const suspended: LandlordApplication[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Landlord;
        const userDoc = await getDoc(doc(db, "users", data.userId));
        const userData = userDoc.data() as User | undefined;

        const landlord: LandlordApplication = {
          ...data,
          id: docSnap.id,
          userName: userData?.displayName,
          userEmail: userData?.email,
        };

        if (!data.approved) {
          pending.push(landlord);
        } else if (data.suspended) {
          suspended.push(landlord);
        } else {
          active.push(landlord);
        }
      }

      setPendingLandlords(pending);
      setActiveLandlords(active);
      setSuspendedLandlords(suspended);
    } catch (err) {
      console.error("Error fetching landlords:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== "admin") {
        router.push("/dashboard");
      } else {
        fetchLandlords();
      }
    }
  }, [user, authLoading, router]);

  const handleApprove = async (landlordId: string) => {
    setProcessing(landlordId);
    try {
      const response = await fetch(`/api/admin/landlords/${landlordId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve");
      }

      await fetchLandlords();
    } catch (err: any) {
      console.error("Approval error:", err);
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (landlordId: string) => {
    if (!confirm("Are you sure you want to reject this application?")) return;

    setProcessing(landlordId);
    try {
      const response = await fetch(`/api/admin/landlords/${landlordId}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject");
      }

      await fetchLandlords();
    } catch (err: any) {
      console.error("Rejection error:", err);
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleSuspend = async (landlordId: string, suspend: boolean) => {
    const action = suspend ? "suspend" : "unsuspend";
    if (!confirm(`Are you sure you want to ${action} this landlord?`)) return;

    setProcessing(landlordId);
    try {
      const response = await fetch(`/api/admin/landlords/${landlordId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspend }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${action}`);
      }

      await fetchLandlords();
    } catch (err: any) {
      console.error(`${action} error:`, err);
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const currentLandlords = 
    activeTab === "pending" ? pendingLandlords :
    activeTab === "active" ? activeLandlords : suspendedLandlords;

  const renderLandlordCard = (landlord: LandlordApplication) => (
    <div key={landlord.id} className="px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary dark:text-primary-dark">
                {landlord.userName?.charAt(0) || "?"}
              </span>
            </div>
            <div>
              <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {landlord.userName || "Unknown User"}
              </p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {landlord.userEmail}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
              <Mail className="h-4 w-4" />
              {landlord.contactEmail}
            </div>
            {landlord.contactPhone && (
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Phone className="h-4 w-4" />
                {landlord.contactPhone}
              </div>
            )}
            <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
              <Calendar className="h-4 w-4" />
              {activeTab === "pending" ? "Applied" : "Approved"}{" "}
              {landlord.applicationDate?.toDate
                ? landlord.applicationDate.toDate().toLocaleDateString()
                : "Unknown"}
            </div>
            {activeTab !== "pending" && (
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Home className="h-4 w-4" />
                {landlord.activeListings} active / {landlord.totalListings} total listings
              </div>
            )}
          </div>

          {landlord.profileDescription && (
            <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
              &ldquo;{landlord.profileDescription}&rdquo;
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {activeTab === "pending" && (
            <>
              <button
                onClick={() => handleApprove(landlord.id)}
                disabled={processing === landlord.id}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing === landlord.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleReject(landlord.id)}
                disabled={processing === landlord.id}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </>
          )}
          {activeTab === "active" && (
            <button
              onClick={() => handleSuspend(landlord.id, true)}
              disabled={processing === landlord.id}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing === landlord.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Suspend
            </button>
          )}
          {activeTab === "suspended" && (
            <button
              onClick={() => handleSuspend(landlord.id, false)}
              disabled={processing === landlord.id}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing === landlord.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Unsuspend
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary dark:text-primary-dark" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            Manage landlord applications and site administration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {pendingLandlords.length}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Pending Applications
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {activeLandlords.length}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Active Landlords
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {suspendedLandlords.length}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Suspended Landlords
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "pending"
                    ? "border-primary dark:border-primary-dark text-primary dark:text-primary-dark"
                    : "border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                Pending ({pendingLandlords.length})
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "active"
                    ? "border-primary dark:border-primary-dark text-primary dark:text-primary-dark"
                    : "border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                Active ({activeLandlords.length})
              </button>
              <button
                onClick={() => setActiveTab("suspended")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "suspended"
                    ? "border-primary dark:border-primary-dark text-primary dark:text-primary-dark"
                    : "border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                Suspended ({suspendedLandlords.length})
              </button>
            </nav>
          </div>

          {currentLandlords.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
                {activeTab === "pending" && "No pending applications"}
                {activeTab === "active" && "No active landlords"}
                {activeTab === "suspended" && "No suspended landlords"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {currentLandlords.map(renderLandlordCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
