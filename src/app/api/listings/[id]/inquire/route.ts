import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    // Allow inquiries from both authenticated and unauthenticated users
    let userId = null;
    if (sessionCookie?.value) {
      const decodedClaims = await adminAuth.verifySessionCookie(
        sessionCookie.value,
        true
      );
      userId = decodedClaims.uid;
    }

    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Verify listing exists and get landlord info
    const listingDoc = await adminDb.collection("listings").doc(id).get();
    if (!listingDoc.exists) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const listingData = listingDoc.data();
    if (!listingData?.contactFormEnabled) {
      return NextResponse.json(
        { error: "Contact form is disabled for this listing" },
        { status: 403 }
      );
    }

    // Check if landlord is suspended
    const landlordDoc = await adminDb
      .collection("landlords")
      .doc(listingData.landlordId)
      .get();

    if (landlordDoc.exists && landlordDoc.data()?.suspended) {
      return NextResponse.json(
        { error: "Listing not available" },
        { status: 404 }
      );
    }

    // Create inquiry document
    const inquiryData = {
      listingId: id,
      landlordId: listingData.landlordId,
      userId, // null for unauthenticated users
      name,
      email,
      phone: phone || null,
      message,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const inquiryRef = await adminDb.collection("inquiries").add(inquiryData);

    // Update listing inquiry count
    await adminDb
      .collection("listings")
      .doc(id)
      .update({
        inquiryCount: FieldValue.increment(1),
      });

    // TODO: Send email notification to landlord
    // This would integrate with Resend to notify the landlord

    return NextResponse.json({
      success: true,
      inquiryId: inquiryRef.id,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
