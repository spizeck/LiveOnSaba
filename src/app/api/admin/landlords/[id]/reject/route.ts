import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/firebase/admin-auth";
import { adminDb } from "@/lib/firebase/admin";

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
        { error: "Cannot reject an approved application" },
        { status: 400 }
      );
    }

    await landlordRef.delete();

    return NextResponse.json({
      success: true,
      message: "Landlord application rejected",
    });
  } catch (error) {
    console.error("Landlord rejection error:", error);
    return NextResponse.json(
      { error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
