"use server";
import { cookies } from "next/headers";
import { adminAuth } from "../firebase/firebaseAdmin";

export async function verifySession() {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session")?.value;

    if (!sessionCookie) {
      return null; // pas connecté
    }

    // Vérifie le token côté serveur
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return decodedClaims; // contient uid, email, etc.
  } catch (error) {
    console.error("Erreur verifySession :", error);
    return null;
  }
}