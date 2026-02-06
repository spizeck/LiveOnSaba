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

    const { contactEmail, contactPhone, profileDescription, showContactPublicly } =
      await request.json();

    if (!contactEmail) {
      return NextResponse.json(
        { error: "Contact email is required" },
        { status: 400 }
      );
    }

    const existingLandlord = await adminDb
      .collection("landlords")
      .doc(decodedClaims.uid)
      .get();

    if (existingLandlord.exists) {
      return NextResponse.json(
        { error: "You have already submitted an application" },
        { status: 400 }
      );
    }

    const landlordData = {
      userId: decodedClaims.uid,
      approved: false,
      applicationDate: FieldValue.serverTimestamp(),
      contactEmail,
      contactPhone: contactPhone || null,
      profileDescription: profileDescription || null,
      showContactPublicly: showContactPublicly ?? true,
      totalListings: 0,
      activeListings: 0,
      reviewCount: 0,
    };

    await adminDb
      .collection("landlords")
      .doc(decodedClaims.uid)
      .set(landlordData);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Landlord application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
