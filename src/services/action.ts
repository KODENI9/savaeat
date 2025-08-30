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


// ✅ Récupérer un client ou une vendeuse par ID
export async function fetchUserByIdAction(
  userId: string,
  userType: "client" | "vendor"
): Promise<Client | Vendor | null> {
  if (!userId) return null;

  try {
    const ref = adminDb
      .collection(userType === "client" ? "clients" : "vendors")
      .doc(userId);

    const snap = await ref.get();
    if (!snap.exists) return null;
    console.log("les donner du user: ", snap.data());
    return snap.data() as Client | Vendor;
  } catch (error) {
    console.error("Erreur Firestore Admin:", error);
    return null; // 🔥 important pour éviter undefined
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
        const { ...vendorData } = vendor;
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

    // Récupérer les infos actuelles du vendeur
    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    const vendorSnap = await vendorRef.get();

    if (!vendorSnap.exists) throw new Error("Vendeur introuvable");

    const vendorData = vendorSnap.data() || {};
    const oldCount = vendorData.ratingsCount || 0;
    const oldAverage = vendorData.averageRating || 0;

    // Nouveau calcul
    const newCount = oldCount + 1;
    const newAverage = (oldAverage * oldCount + rating) / newCount;

    // Mettre à jour le vendeur
    await vendorRef.update({
      ratingsCount: FieldValue.increment(1),
      averageRating: newAverage,
    });

    return { success: true };
  } catch (err) {
    console.error("Erreur addReviewAction:", err);
    throw err;
  }
}

// ✅ Mettre à jour un Avis
export async function updateReviewAction(
  reviewId: string,
  vendorId: string,
  newRating: number,
  newComment: string
) {
  try {
    const reviewRef = adminDb.collection("reviews").doc(reviewId);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) throw new Error("Avis introuvable");
    const oldReview = reviewSnap.data()!;
    const oldRating = oldReview.rating;

    // Mettre à jour le review
    await reviewRef.update({
      rating: newRating,
      comment: newComment,
      updatedAt: Timestamp.now(),
    });

    // Recalcul de la moyenne
    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    const vendorSnap = await vendorRef.get();
    const vendorData = vendorSnap.data()!;

    const count = vendorData.ratingsCount || 0;
    const oldAverage = vendorData.averageRating || 0;

    // Formule: on enlève l’ancienne note, on ajoute la nouvelle
    const newAverage = (oldAverage * count - oldRating + newRating) / count;

    await vendorRef.update({ averageRating: newAverage });

    return { success: true };
  } catch (err) {
    console.error("Erreur updateReviewAction:", err);
    throw err;
  }
}


// ✅ Supprimer un Avis

export async function deleteReviewAction(reviewId: string, vendorId: string) {
  try {
    const reviewRef = adminDb.collection("reviews").doc(reviewId);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) throw new Error("Avis introuvable");
    const reviewData = reviewSnap.data()!;
    const oldRating = reviewData.rating;

    // Supprimer l'avis
    await reviewRef.delete();

    // Mettre à jour le vendeur
    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    const vendorSnap = await vendorRef.get();
    const vendorData = vendorSnap.data()!;

    const oldCount = vendorData.ratingsCount || 0;
    const oldAverage = vendorData.averageRating || 0;

    // Cas particulier : si c’était le dernier avis → remettre à zéro
    if (oldCount <= 1) {
      await vendorRef.update({
        ratingsCount: 0,
        averageRating: 0,
      });
      return { success: true };
    }

    const newCount = oldCount - 1;
    const newAverage = (oldAverage * oldCount - oldRating) / newCount;

    await vendorRef.update({
      ratingsCount: FieldValue.increment(-1),
      averageRating: newAverage,
    });

    return { success: true };
  } catch (err) {
    console.error("Erreur deleteReviewAction:", err);
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
    const { ...clientData } = client;
    await adminDb.collection("clients").doc(clientId).update(clientData);
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    throw new Error("Impossible de mettre à jour le profil.");
  }
}



