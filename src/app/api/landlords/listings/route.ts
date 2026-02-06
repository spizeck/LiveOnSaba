import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );

    // Verify user is a landlord
    const userDoc = await adminDb
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData?.role !== "landlord" && userData?.role !== "admin") {
      return NextResponse.json(
        { error: "Landlord access required" },
        { status: 403 }
      );
    }

    // Check if landlord is approved and not suspended
    const landlordDoc = await adminDb
      .collection("landlords")
      .doc(decodedClaims.uid)
      .get();

    if (!landlordDoc.exists || !landlordDoc.data()?.approved) {
      return NextResponse.json(
        { error: "Landlord account not approved" },
        { status: 403 }
      );
    }

    if (landlordDoc.data()?.suspended) {
      return NextResponse.json(
        { error: "Landlord account is suspended" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      monthlyRent,
      area,
      address,
      bedrooms,
      bathrooms,
      squareFootage,
      status,
      furnished,
      petsAllowed,
      parking,
      secondOccupant,
      utilities,
      photos,
      primaryPhotoIndex,
      contactFormEnabled,
      showContactInfo,
    } = body;

    // Validate required fields
    if (!title || !description || !monthlyRent || !area || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const listingData = {
      landlordId: decodedClaims.uid,
      title,
      description,
      monthlyRent,
      area,
      address,
      location: { latitude: 17.63, longitude: -63.24 }, // Default Saba coordinates
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 1,
      squareFootage: squareFootage || null,
      status: status || "available",
      availableFrom: FieldValue.serverTimestamp(),
      furnished: furnished || "no",
      petsAllowed: petsAllowed || "no",
      parking: parking || "street",
      secondOccupant: secondOccupant || "not-allowed",
      utilities: utilities || {
        electric: "no",
        water: "no",
        internet: "no",
      },
      photos: photos || [],
      primaryPhotoIndex: primaryPhotoIndex || 0,
      contactFormEnabled: contactFormEnabled ?? true,
      showContactInfo: showContactInfo ?? true,
      lastVerifiedAt: FieldValue.serverTimestamp(),
      featured: false,
      viewCount: 0,
      inquiryCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("listings").add(listingData);

    // Update landlord's listing counts
    const landlordData = landlordDoc.data();
    await adminDb
      .collection("landlords")
      .doc(decodedClaims.uid)
      .update({
        totalListings: (landlordData?.totalListings || 0) + 1,
        activeListings:
          status === "available"
            ? (landlordData?.activeListings || 0) + 1
            : landlordData?.activeListings || 0,
      });

    return NextResponse.json({
      success: true,
      listingId: docRef.id,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
