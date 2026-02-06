import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const area = searchParams.get("area");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minBedrooms = searchParams.get("minBedrooms");
    const status = searchParams.get("status") || "available";

    // Get all suspended landlord IDs
    const suspendedLandlordsSnapshot = await adminDb
      .collection("landlords")
      .where("suspended", "==", true)
      .get();
    
    const suspendedLandlordIds = new Set(
      suspendedLandlordsSnapshot.docs.map((doc) => doc.id)
    );

    // Build listings query
    let query: FirebaseFirestore.Query = adminDb.collection("listings");

    // Filter by status
    if (status !== "all") {
      query = query.where("status", "==", status);
    }

    // Filter by area
    if (area && area !== "all") {
      query = query.where("area", "==", area);
    }

    // Execute query
    console.log("Executing listings query with status:", status);
    const snapshot = await query.orderBy("createdAt", "desc").get();
    console.log("Query returned", snapshot.docs.length, "documents");

    // Filter results in memory (for price, bedrooms, and suspended landlords)
    const listings = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
        availableFrom: doc.data().availableFrom?.toDate?.()?.toISOString() || null,
        lastVerifiedAt: doc.data().lastVerifiedAt?.toDate?.()?.toISOString() || null,
      }))
      .filter((listing: any) => {
        // Exclude suspended landlords
        if (suspendedLandlordIds.has(listing.landlordId)) {
          return false;
        }

        // Filter by price
        if (minPrice && listing.monthlyRent < parseInt(minPrice)) {
          return false;
        }
        if (maxPrice && listing.monthlyRent > parseInt(maxPrice)) {
          return false;
        }

        // Filter by bedrooms
        if (minBedrooms && listing.bedrooms < parseInt(minBedrooms)) {
          return false;
        }

        return true;
      });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
