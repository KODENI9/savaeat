import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/src/firebase/firebase";

export async function _toggleLike(vendorId: string, clientId: string) {
  const vendorRef = doc(db, "vendors", vendorId);
  const clientRef = doc(db, "clients", clientId);

  // On check si déjà liké
  const vendorDoc = await getDoc(vendorRef);
  const vendorData = vendorDoc.data();

  const alreadyLiked = vendorData?.likedByClients?.includes(clientId);

  if (alreadyLiked) {
    // Unlike
    await updateDoc(vendorRef, {
      likedByClients: arrayRemove(clientId),
    });
    await updateDoc(clientRef, {
      favoriteVendorIds: arrayRemove(vendorId),
    });
  } else {
    // Like
    await updateDoc(vendorRef, {
      likedByClients: arrayUnion(clientId),
    });
    await updateDoc(clientRef, {
      favoriteVendorIds: arrayUnion(vendorId),
    });
  }
}
