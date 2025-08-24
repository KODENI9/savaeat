// app/actions.ts
"use server";
import { adminDb } from "../firebase/firebaseAdmin";
import { Client, Vendor } from "../types";
import getDistanceKm from "../utils/distance";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

// ✅ Récupérer les vendeuses
export async function fetchVendorsAction(
  userLoc: { lat: number; lng: number },
  radiusKm: number,
  search: string
): Promise<Vendor[]> {
  if (!userLoc) return [];

  try {
    const snapshot = await adminDb.collection("vendors").get();

    const vendeuses: Vendor[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        profileImageUrl: data.profileImageUrl || "/placeholder.png",
        bannerImageUrl: data.bannerImageUrl || "",
        shopName: data.shopName || "",
        address: data.address || "",
        latitude: data.latitude,
        longitude: data.longitude,
        phoneNumber: data.phoneNumber || "",
        likedByClients: data.likedByClients || [],
        averageRating: data.averageRating || 0,
        ratingsCount: data.ratingsCount || 0,
        createdAt: data.createdAt
          ? Number(data.createdAt)
          : Date.now(),
      };
    });

    // 📌 Ajout distance + filtrage
    const filtered = vendeuses
      .map((v) => ({
        ...v,
        distanceKm: getDistanceKm(
          userLoc.lat,
          userLoc.lng,
          v.latitude,
          v.longitude
        ),
      }))
      .filter(
        (v) =>
          v.distanceKm! <= radiusKm &&
          v.name.toLowerCase().includes(search.toLowerCase())
      );

    return filtered;
  } catch (err) {
    console.error("Erreur Firestore Admin:", err);
    throw new Error("Impossible de charger les vendeuses");
  }
}

// ✅ Récupérer une vendeuse par ID
export async function fetchVendorByIdAction(vendorId: string): Promise<Vendor | null> {
    if (!vendorId) return null;
    try {
        const doc = await adminDb.collection("vendors").doc(vendorId).get();
        if (!doc.exists) return null;

        const data = doc.data();
        return data ? {
            id: doc.id,
            name: data.name,
            email: data.email,
            profileImageUrl: data.profileImageUrl || "/placeholder.png",
            bannerImageUrl: data.bannerImageUrl || "",
            shopName: data.shopName || "",
            address: data.address || "",
            latitude: data.latitude,
            longitude: data.longitude,
            phoneNumber: data.phoneNumber || "",
            likedByClients: data.likedByClients || [],
            averageRating: data.averageRating || 0,
            ratingsCount: data.ratingsCount || 0,
            createdAt: data.createdAt ? Number(data.createdAt) : Date.now(),
        } : null;
    } catch (error) {
        console.error("Erreur Firestore Admin:", error);
        return null;
        
    }
}

// ✅ Enregistrer une vendeuse
export async function saveVendorAction(vendor: Vendor, vendorId: string): Promise<void> {
    if (!vendor || !vendorId) return;
    try {
        const { id:_id , ...vendorData } = vendor;
        await adminDb.collection("vendors").doc(vendorId).update(vendorData);
    } catch (error) {
        console.error("Erreur mise à jour profil:", error);
        throw new Error("Impossible de mettre à jour le profil.");
        
    }
}


// ✅ Récupérer vendeur + reviews
export async function getVendorWithReviews(vendorId: string) {
  try {
    const vendorSnap = await adminDb.collection("vendors").doc(vendorId).get();
    if (!vendorSnap.exists) return null;

    const reviewsSnap = await adminDb
      .collection("reviews")
      .where("vendorId", "==", vendorId)
      .get();

    const reviews = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return {
      vendor: { id: vendorSnap.id, ...vendorSnap.data() },
      reviews,
    };
  } catch (err) {
    console.error("Erreur getVendorWithReviews:", err);
    throw err;
  }
}

// ✅ Ajouter un avis
export async function addReviewAction(
  vendorId: string,
  clientId: string,
  clientName: string,
  rating: number,
  comment: string
) {
  try {
    const reviewRef = adminDb.collection("reviews").doc();

    await reviewRef.set({
      clientId,
      clientName,
      vendorId,
      rating,
      comment,
      createdAt: Timestamp.now(),
    });

    // Incrémenter ratingsCount dans vendors
    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    await vendorRef.update({
      ratingsCount: FieldValue.increment(1),
    });

    return { success: true };
  } catch (err) {
    console.error("Erreur addReviewAction:", err);
    throw err;
  }
}

// ✅ Toggle like
export async function toggleLikeAction(vendorId: string, clientId: string) {
  try {
    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    const vendorSnap = await vendorRef.get();

    if (!vendorSnap.exists) throw new Error("Vendor introuvable");

    const likedByClients = vendorSnap.data()?.likedByClients || [];

    const alreadyLiked = likedByClients.includes(clientId);
    await vendorRef.update({
      likedByClients: alreadyLiked
        ? FieldValue.arrayRemove(clientId)
        : FieldValue.arrayUnion(clientId),
    });

    return { success: true, liked: !alreadyLiked };
  } catch (err) {
    console.error("Erreur toggleLikeAction:", err);
    throw err;
  }
}

// ✅ Récupération d'un client par ID 

export async function fetchClientByIdAction(clientId: string): Promise<Client | null> {
  if (!clientId) return null;
  try {
    const ref = adminDb.collection("clients").doc(clientId)
    const snap = await ref.get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data ? {
      id: snap.id,
      name: data.name,
      email: data.email,
      profileImageUrl: data.profileImageUrl || "/placeholder.png",
      bannerImageUrl: data.bannerImageUrl || "",
      favoriteVendorIds: data.favoriteVendorIds || [],
      reviewIds: data.reviewIds || [],
      createdAt: data.createdAt ? Number(data.createdAt) : Date.now(),
    } : null;
  } catch (error) {
    console.error("Erreur Firestore Admin:", error);
    return null;
  }
}

// ✅ Enregistrer un client 
export async function saveClientAction(client: Client, clientId: string): Promise<void> {
  if (!client || !clientId) return;
  try {
    const { id:_id, ...clientData } = client;
    await adminDb.collection("clients").doc(clientId).update(clientData);
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    throw new Error("Impossible de mettre à jour le profil.");
  }
}



