// services/vendeuseService.ts
import { collection, getDocs } from "firebase/firestore";
import { VendeuseProfile } from "../types";
import { db } from "../firebase/firebase";
import { getDistanceKm } from "../utils/distance";


export async function getNearbyVendeuses(
  userLat: number,
  userLng: number,
  maxDistanceKm: number
): Promise<VendeuseProfile[]> {
  const vendeusesRef = collection(db, "users");
  const snapshot = await getDocs(vendeusesRef);

  const vendeuses: VendeuseProfile[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as VendeuseProfile;

    if (data.role === "vendeuse" && data.location) {
      const dist = getDistanceKm(
        userLat,
        userLng,
        data.location.lat,
        data.location.lng
      );
      if (dist <= maxDistanceKm) {
        vendeuses.push({ ...data, distance: dist });
      }
    }
  });

  // Trier par distance croissante
  return vendeuses.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}
