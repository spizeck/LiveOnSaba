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
    const { suspend } = await request.json();

    const landlordRef = adminDb.collection("landlords").doc(landlordId);
    const landlordDoc = await landlordRef.get();

    if (!landlordDoc.exists) {
      return NextResponse.json(
        { error: "Landlord not found" },
        { status: 404 }
      );
    }

    const landlordData = landlordDoc.data();

    if (!landlordData?.approved) {
      return NextResponse.json(
        { error: "Cannot suspend an unapproved landlord" },
        { status: 400 }
      );
    }

    if (suspend) {
      await landlordRef.update({
        suspended: true,
        suspendedAt: FieldValue.serverTimestamp(),
        suspendedBy: adminResult.uid,
      });
    } else {
      await landlordRef.update({
        suspended: false,
        suspendedAt: FieldValue.delete(),
        suspendedBy: FieldValue.delete(),
      });
    }

    return NextResponse.json({
      success: true,
      message: suspend ? "Landlord suspended" : "Landlord unsuspended",
    });
  } catch (error) {
    console.error("Landlord suspend error:", error);
    return NextResponse.json(
      { error: "Failed to update landlord status" },
      { status: 500 }
    );
  }
}
