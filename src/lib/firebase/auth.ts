import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onIdTokenChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { User } from "@/lib/types";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "user" | "landlord" | "admin";
};

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, { displayName });

  const userData: Omit<User, "id"> = {
    email,
    displayName,
    role: "user",
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
    isVerifiedTenant: false,
    savedListings: [],
    savedSearches: [],
    emailNotifications: true,
    notificationFrequency: "instant",
  };

  await setDoc(doc(db, "users", userCredential.user.uid), userData);

  const idToken = await userCredential.user.getIdToken();
  await syncSessionCookie(idToken);

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName,
    role: "user",
  };
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthUser> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  const userData = userDoc.data() as User | undefined;

  const idToken = await userCredential.user.getIdToken();
  await syncSessionCookie(idToken);

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    role: userData?.role || "user",
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  let role: "user" | "landlord" | "admin" = "user";

  if (!userDoc.exists()) {
    const userData: Omit<User, "id"> = {
      email: userCredential.user.email || "",
      displayName: userCredential.user.displayName || "",
      role: "user",
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      isVerifiedTenant: false,
      savedListings: [],
      savedSearches: [],
      emailNotifications: true,
      notificationFrequency: "instant",
    };
    await setDoc(doc(db, "users", userCredential.user.uid), userData);
  } else {
    role = (userDoc.data() as User).role;
  }

  const idToken = await userCredential.user.getIdToken();
  await syncSessionCookie(idToken);

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    role,
  };
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

async function syncSessionCookie(idToken: string): Promise<void> {
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onIdTokenChanged(auth, async (user) => {
    if (user) {
      const idToken = await user.getIdToken();
      await syncSessionCookie(idToken);
    }
    callback(user);
  });
}

export async function getUserData(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
}
