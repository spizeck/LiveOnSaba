"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  ArrowLeft,
  Home,
  MapPin,
  DollarSign,
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
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Area, ListingStatus, FurnishedStatus, PetPolicy, ParkingType, OccupantPolicy, UtilityIncluded } from "@/lib/types";

const AREAS: { value: Area; label: string }[] = [
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

export default function NewListingPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [area, setArea] = useState<Area>("windwardside");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [squareFootage, setSquareFootage] = useState("");
  const [status, setStatus] = useState<ListingStatus>("available");
  const [furnished, setFurnished] = useState<FurnishedStatus>("no");
  const [petsAllowed, setPetsAllowed] = useState<PetPolicy>("no");
  const [parking, setParking] = useState<ParkingType>("street");
  const [secondOccupant, setSecondOccupant] = useState<OccupantPolicy>("not-allowed");
  
  // Utilities
  const [electricIncluded, setElectricIncluded] = useState<UtilityIncluded>("no");
  const [electricAllowance, setElectricAllowance] = useState("");
  const [waterIncluded, setWaterIncluded] = useState<UtilityIncluded>("no");
  const [internetIncluded, setInternetIncluded] = useState<UtilityIncluded>("no");
  const [otherUtilityDetails, setOtherUtilityDetails] = useState("");

  // Photos (URLs for now)
  const [photoUrls, setPhotoUrls] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const photos = photoUrls.filter((url) => url.trim() !== "");

      const response = await fetch("/api/landlords/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          monthlyRent: parseInt(monthlyRent),
          area,
          address,
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          squareFootage: squareFootage ? parseInt(squareFootage) : null,
          status,
          furnished,
          petsAllowed,
          parking,
          secondOccupant,
          utilities: {
            electric: electricIncluded,
            electricAllowance: electricAllowance || null,
            water: waterIncluded,
            internet: internetIncluded,
            otherDetails: otherUtilityDetails || null,
          },
          photos,
          primaryPhotoIndex: 0,
          contactFormEnabled: true,
          showContactInfo: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      router.push("/landlord");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const addPhotoUrl = () => {
    setPhotoUrls([...photoUrls, ""]);
  };

  const updatePhotoUrl = (index: number, value: string) => {
    const newUrls = [...photoUrls];
    newUrls[index] = value;
    setPhotoUrls(newUrls);
  };

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  if (!user || (userData?.role !== "landlord" && userData?.role !== "admin")) {
    router.push("/landlord/apply");
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[calc(100vh-200px)] py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/landlord"
            className="inline-flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Landlord Portal
          </Link>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Create New Listing
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-primary dark:text-primary-dark" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="e.g., Charming 2BR Cottage in Windwardside"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
                  placeholder="Describe your property..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Monthly Rent (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      required
                      min="0"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                      placeholder="1500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ListingStatus)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="pending">Pending</option>
                    <option value="off-market">Off Market</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary dark:text-primary-dark" />
              Location
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as Area)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  {AREAS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="e.g., Booby Hill Road 12, Windwardside"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary dark:text-primary-dark" />
              Property Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  <option value="0">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Square Footage
                </label>
                <input
                  type="number"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Features & Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Furnished
                </label>
                <select
                  value={furnished}
                  onChange={(e) => setFurnished(e.target.value as FurnishedStatus)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  <option value="yes">Fully Furnished</option>
                  <option value="partial">Partially Furnished</option>
                  <option value="no">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Pets Allowed
                </label>
                <select
                  value={petsAllowed}
                  onChange={(e) => setPetsAllowed(e.target.value as PetPolicy)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  <option value="yes">Yes</option>
                  <option value="negotiable">Negotiable</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Parking
                </label>
                <select
                  value={parking}
                  onChange={(e) => setParking(e.target.value as ParkingType)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  <option value="on-property">On Property</option>
                  <option value="street">Street Parking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Second Occupant
                </label>
                <select
                  value={secondOccupant}
                  onChange={(e) => setSecondOccupant(e.target.value as OccupantPolicy)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                >
                  <option value="allowed">Allowed</option>
                  <option value="additional-fee">Additional Fee</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary dark:text-primary-dark" />
              Utilities
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Electric
                  </label>
                  <select
                    value={electricIncluded}
                    onChange={(e) => setElectricIncluded(e.target.value as UtilityIncluded)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  >
                    <option value="yes">Included</option>
                    <option value="partial">Partial</option>
                    <option value="no">Not Included</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Water
                  </label>
                  <select
                    value={waterIncluded}
                    onChange={(e) => setWaterIncluded(e.target.value as UtilityIncluded)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  >
                    <option value="yes">Included</option>
                    <option value="partial">Partial</option>
                    <option value="no">Not Included</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Internet
                  </label>
                  <select
                    value={internetIncluded}
                    onChange={(e) => setInternetIncluded(e.target.value as UtilityIncluded)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  >
                    <option value="yes">Included</option>
                    <option value="partial">Partial</option>
                    <option value="no">Not Included</option>
                  </select>
                </div>
              </div>

              {electricIncluded === "partial" && (
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                    Electric Allowance Details
                  </label>
                  <input
                    type="text"
                    value={electricAllowance}
                    onChange={(e) => setElectricAllowance(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                    placeholder="e.g., $75/month included, tenant pays overage"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                  Other Utility Details
                </label>
                <input
                  type="text"
                  value={otherUtilityDetails}
                  onChange={(e) => setOtherUtilityDetails(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="e.g., Cistern water, backup generator available"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary dark:text-primary-dark" />
              Photos
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Add photo URLs for your listing. The first photo will be the primary image.
            </p>

            <div className="space-y-3">
              {photoUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updatePhotoUrl(index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                    placeholder="https://example.com/photo.jpg"
                  />
                  {photoUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhotoUrl(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhotoUrl}
                className="text-sm text-primary dark:text-primary-dark hover:underline"
              >
                + Add another photo
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/landlord"
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 text-text-primary-light dark:text-text-primary-dark font-semibold rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
