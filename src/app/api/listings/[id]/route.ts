import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listingDoc = await adminDb.collection("listings").doc(id).get();

    if (!listingDoc.exists) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const listingData = listingDoc.data();

    // Check if landlord is suspended
    const landlordDoc = await adminDb
      .collection("landlords")
      .doc(listingData?.landlordId)
      .get();

    if (landlordDoc.exists && landlordDoc.data()?.suspended) {
      return NextResponse.json(
        { error: "Listing not available" },
        { status: 404 }
      );
    }

    // Get landlord info for display
    const landlordData = landlordDoc.data();
    const userDoc = await adminDb
      .collection("users")
      .doc(listingData?.landlordId)
      .get();
    const userData = userDoc.data();

    const listing = {
      id: listingDoc.id,
      ...listingData,
      createdAt: listingData?.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: listingData?.updatedAt?.toDate?.()?.toISOString() || null,
      availableFrom: listingData?.availableFrom?.toDate?.()?.toISOString() || null,
      lastVerifiedAt: listingData?.lastVerifiedAt?.toDate?.()?.toISOString() || null,
      landlord: {
        displayName: userData?.displayName || "Unknown",
        profileDescription: landlordData?.profileDescription,
        contactEmail: landlordData?.showContactPublicly ? landlordData?.contactEmail : null,
        contactPhone: landlordData?.showContactPublicly ? landlordData?.contactPhone : null,
        averageRating: landlordData?.averageRating,
        reviewCount: landlordData?.reviewCount,
      },
    };

    // Increment view count (fire and forget)
    adminDb
      .collection("listings")
      .doc(id)
      .update({
        viewCount: (listingData?.viewCount || 0) + 1,
      })
      .catch(() => {});

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
