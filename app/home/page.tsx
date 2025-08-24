"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Vendor } from "@/src/types";
import Image from "next/image";
import { fetchVendorsAction } from "@/src/services/action";
import ProtectedPage from "../components/ProtectedPage";
import Wrapper from "../components/Wrapper";

export default function RecherchePage() {
  const [search, setSearch] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<(Vendor & { distanceKm?: number })[]>([]);

  const router = useRouter();

  


  // 📍 Récupération position utilisateur
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setError("Impossible de récupérer la position veillez verifier votre connection internet"),
        { enableHighAccuracy: true }
      );
    } else {
      setError("Géolocalisation non supportée");
    }
  }, []);

  // 🔥 Récupération vendeuses Firestore
  useEffect(() => {
    const loadVendors = async () =>{
      if (!userLoc) return;

      setLoading(true);
      try {
        const vendors = await fetchVendorsAction(userLoc, radiusKm, search);
        setVendors(vendors);
      } catch (err) {
        console.error("Erreur lors de la récupération des vendeuses :", err);
        setError("Impossible de charger les vendeuses");
      } finally {
        setLoading(false);
      }
    }

    loadVendors();
  }, [userLoc, search, radiusKm]);

  // 🔄 Réinitialisation des résultats si la position change
  useEffect(() => {
    if (userLoc) {
      setVendors([]);
      setSearch("");
      setRadiusKm(5);  
      setError("");
    }
  }, [userLoc]);



  return (
    <ProtectedPage>
    <Wrapper>
      <div className="max-w-4xl mx-auto">
        {/* Barre de recherche */}
        <div className="card bg-base-100 shadow mb-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm">Recherche (nom)</label>
              <input
                className="input input-bordered w-full"
                placeholder="Ex : Awa, Fatou..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-48">
              <label className="block text-sm">Rayon : {radiusKm} km</label>
              <input
                type="range"
                min={0.5}
                max={20}
                step={0.5}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="range range-xs"
              />
            </div>

            <div className="w-40">
              <label className="block text-sm">Ma position</label>
              <div className="text-sm">
                {userLoc ? (
                  <span>
                    {userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)}
                  </span>
                ) : error ? (
                  <span className="text-red-500">{error}</span>
                ) : (
                  <span>Récupération...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Liste vendeuses */}
        {loading ? (
          <div className="text-center py-8">Recherche des vendeuses…</div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-8">
            Aucune vendeuse trouvée dans ce rayon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Image bannière si dispo */}
                {v.bannerImageUrl && (
                  <Image
                    src={v.bannerImageUrl}
                    alt={`Bannière de ${v.shopName}`}
                    width={600}
                    height={96}
                    className="w-full h-24 object-cover"
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                )}

                <div className="flex gap-4 p-5 items-center">
                  <Image
                  src={v.profileImageUrl}
                  alt={v.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-xl object-cover ring-1 ring-gray-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.png";
                  }}
                  />

                  <div className="flex-1">
                  {/* Nom + Adresse + Étoiles */}
                  <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {v.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {v.address || "Adresse non renseignée"}
                    </p>
                    </div>
                    <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                      ⭐ {v.averageRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {v.ratingsCount} avis
                    </div>
                    </div>
                  </div>

                  {/* Distance + Bouton */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                    {v.distanceKm?.toFixed(2)} km
                    </span>
                    <button
                    className="btn btn-sm btn-accent rounded-full px-4 shadow-md hover:shadow-lg transition"
                    onClick={() => router.push(`/vendeuses/${v.id}`)}
                    >
                    Voir
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
    </ProtectedPage>
  );
}
