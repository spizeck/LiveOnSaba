/**
 * Mock Data Seed Script
 * Run with: npm run seed
 */

import { config } from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Initialize Firebase Admin using same credentials as the app
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

async function seedMockData() {
  console.log("🌱 Starting mock data seed...\n");

  // Create mock user for the landlord
  const mockUserId = "mock-landlord-user-001";
  const mockUser = {
    email: "maria.santos@example.com",
    displayName: "Maria Santos",
    role: "landlord",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    isVerifiedTenant: false,
    savedListings: [],
    savedSearches: [],
    emailNotifications: true,
    notificationFrequency: "instant",
  };

  console.log("Creating mock user...");
  await db.collection("users").doc(mockUserId).set(mockUser);
  console.log("✓ User created: Maria Santos\n");

  // Create mock landlord
  const mockLandlord = {
    userId: mockUserId,
    approved: true,
    approvedAt: FieldValue.serverTimestamp(),
    approvedBy: "system",
    applicationDate: FieldValue.serverTimestamp(),
    profileDescription:
      "Long-time Saba resident with beautifully maintained rental properties. I take pride in providing comfortable homes for island newcomers.",
    contactEmail: "maria.santos@example.com",
    contactPhone: "+599 416 5678",
    showContactPublicly: true,
    totalListings: 2,
    activeListings: 2,
    averageRating: 4.8,
    reviewCount: 12,
  };

  console.log("Creating mock landlord...");
  await db.collection("landlords").doc(mockUserId).set(mockLandlord);
  console.log("✓ Landlord created: Maria Santos\n");

  // Create mock listing 1 - Windwardside cottage
  const listing1Id = "mock-listing-001";
  const listing1 = {
    landlordId: mockUserId,
    title: "Charming Windwardside Cottage with Ocean Views",
    description: `Beautiful 2-bedroom cottage nestled in the heart of Windwardside, Saba's main village. This cozy home features stunning ocean views from the wrap-around veranda, perfect for morning coffee while watching the sunrise.

The cottage has been recently renovated with modern amenities while maintaining its Caribbean charm. Hardwood floors throughout, fully equipped kitchen, and reliable internet make this ideal for remote workers or those seeking island tranquility.

Walking distance to local restaurants, shops, and the famous Mount Scenery trailhead. The property includes a private garden with tropical fruit trees.`,
    monthlyRent: 1800,
    area: "windwardside",
    address: "Booby Hill Road 12, Windwardside",
    location: { latitude: 17.6311, longitude: -63.2369 },
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 850,
    status: "available",
    availableFrom: FieldValue.serverTimestamp(),
    furnished: "yes",
    petsAllowed: "negotiable",
    parking: "on-property",
    secondOccupant: "allowed",
    utilities: {
      electric: "partial",
      electricAllowance: "$75/month included, tenant pays overage",
      water: "yes",
      internet: "yes",
      otherDetails: "Cistern water, backup generator available",
    },
    photos: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    primaryPhotoIndex: 0,
    contactFormEnabled: true,
    showContactInfo: true,
    lastVerifiedAt: FieldValue.serverTimestamp(),
    featured: true,
    viewCount: 234,
    inquiryCount: 18,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  console.log("Creating listing 1...");
  await db.collection("listings").doc(listing1Id).set(listing1);
  console.log("✓ Listing created: Charming Windwardside Cottage\n");

  // Create mock listing 2 - The Bottom apartment
  const listing2Id = "mock-listing-002";
  const listing2 = {
    landlordId: mockUserId,
    title: "Modern Studio in The Bottom - Perfect for Singles",
    description: `Newly renovated studio apartment located in The Bottom, Saba's administrative capital. This efficient living space is perfect for single professionals or students attending the Saba University School of Medicine.

Features include a Murphy bed, compact kitchenette with modern appliances, updated bathroom with rain shower, and a small private balcony. The building has secure entry and shared laundry facilities.

Just steps away from government offices, the hospital, and local cafes. Great public transportation connections to other parts of the island.`,
    monthlyRent: 950,
    area: "the-bottom",
    address: "Main Street 45, The Bottom",
    location: { latitude: 17.6256, longitude: -63.2497 },
    bedrooms: 0,
    bathrooms: 1,
    squareFootage: 400,
    status: "available",
    availableFrom: FieldValue.serverTimestamp(),
    furnished: "yes",
    petsAllowed: "no",
    parking: "street",
    secondOccupant: "not-allowed",
    utilities: {
      electric: "no",
      water: "yes",
      internet: "no",
      otherDetails: "Tenant responsible for electric and internet setup",
    },
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    primaryPhotoIndex: 0,
    contactFormEnabled: true,
    showContactInfo: true,
    lastVerifiedAt: FieldValue.serverTimestamp(),
    featured: false,
    viewCount: 89,
    inquiryCount: 7,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  console.log("Creating listing 2...");
  await db.collection("listings").doc(listing2Id).set(listing2);
  console.log("✓ Listing created: Modern Studio in The Bottom\n");

  console.log("🎉 Mock data seeded successfully!");
  console.log("\nSummary:");
  console.log("- 1 User (Maria Santos - landlord role)");
  console.log("- 1 Landlord profile (approved)");
  console.log("- 2 Listings (Windwardside cottage + The Bottom studio)");
}

seedMockData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  });
