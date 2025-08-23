import { db } from "@/src/firebase/firebase";
import { doc, updateDoc, collection, addDoc, increment, getDoc } from "firebase/firestore";

export async function addReview(vendorId: string, clientId: string,  rating: number, comment: string) {
  // 1️⃣ Ajout de l’avis dans la collection "reviews"
  const reviewsRef = collection(db, "reviews");
  const newReview = {
    vendorId,
    clientId,
    rating,
    comment,
    createdAt: Date.now(),
  };
  await addDoc(reviewsRef, newReview);

  // 2️⃣ Mise à jour du vendor
  const vendorRef = doc(db, "vendors", vendorId);
  const vendorSnap = await getDoc(vendorRef);

  if (vendorSnap.exists()) {
    const vendorData = vendorSnap.data();
    const currentCount = vendorData.ratingsCount || 0;
    const currentAverage = vendorData.ratingAverage || 0;

    // Nouvelle moyenne : (ancienneSomme + nouveauRating) / nouveauTotal
    const newCount = currentCount + 1;
    const newAverage = ((currentAverage * currentCount) + rating) / newCount;

    await updateDoc(vendorRef, {
      ratingsCount: increment(1),
      ratingAverage: newAverage,
    });
  }
}
