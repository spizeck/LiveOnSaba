import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./admin";

export type AdminVerifyResult =
  | { success: true; uid: string; email: string }
  | { success: false; error: string };

export async function verifyAdmin(): Promise<AdminVerifyResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return { success: false, error: "Authentication required" };
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );

    const userDoc = await adminDb
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }

    const userData = userDoc.data();
    if (userData?.role !== "admin") {
      return { success: false, error: "Admin access required" };
    }

    return {
      success: true,
      uid: decodedClaims.uid,
      email: decodedClaims.email || "",
    };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { success: false, error: "Authentication failed" };
  }
}
