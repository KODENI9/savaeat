import { addDoc, collection, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function addReview(vendorId: string, clientId: string, clientName: string, rating: number, comment: string) {
  const reviewsRef = collection(db, "reviews");

  // Création du review
  const newReview = {
    clientId,
    clientName,
    vendorId,
    rating,
    comment,
    createdAt: Date.now(),
  };

  const reviewDoc = await addDoc(reviewsRef, newReview);

  // Update vendor et client
  await updateDoc(doc(db, "vendors", vendorId), {
    reviewIds: arrayUnion(reviewDoc.id),
  });

  await updateDoc(doc(db, "clients", clientId), {
    reviewIds: arrayUnion(reviewDoc.id),
  });

  return reviewDoc.id;
}
