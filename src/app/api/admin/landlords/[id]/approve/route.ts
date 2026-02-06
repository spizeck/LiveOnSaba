import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/firebase/admin-auth";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await verifyAdmin();

    if (!adminResult.success) {
      return NextResponse.json(
        { error: adminResult.error },
        { status: adminResult.error === "Admin access required" ? 403 : 401 }
      );
    }

    const { id: landlordId } = await params;

    const landlordRef = adminDb.collection("landlords").doc(landlordId);
    const landlordDoc = await landlordRef.get();

    if (!landlordDoc.exists) {
      return NextResponse.json(
        { error: "Landlord application not found" },
        { status: 404 }
      );
    }

    const landlordData = landlordDoc.data();

    if (landlordData?.approved) {
      return NextResponse.json(
        { error: "Application already approved" },
        { status: 400 }
      );
    }

    const batch = adminDb.batch();

    batch.update(landlordRef, {
      approved: true,
      approvedAt: FieldValue.serverTimestamp(),
      approvedBy: adminResult.uid,
    });

    const userRef = adminDb.collection("users").doc(landlordData?.userId);
    batch.update(userRef, {
      role: "landlord",
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Landlord application approved",
    });
  } catch (error) {
    console.error("Landlord approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve application" },
      { status: 500 }
    );
  }
}
