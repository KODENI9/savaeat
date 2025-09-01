"use client";
import { useState, useEffect } from "react";
import { Vendor } from "@/src/types";
import { fetchVendorsAction } from "@/src/services/action";
import ProtectedPage from "../components/ProtectedPage";
import Wrapper from "../components/Wrapper";
import Skeleton from "../components/Skeleton";
import VendorCard from "../components/VendorCard";
import Loader from "../components/Loader";

export default function RecherchePage() {
  const [search, setSearch] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<(Vendor & { distanceKm?: number })[]>(
    []
  );

  // 📍 Récupération position utilisateur
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () =>
          setError(
            "Impossible de récupérer la position veillez verifier votre connection internet"
          ),
        { enableHighAccuracy: true }
      );
    } else {
      setError("Géolocalisation non supportée");
    }
  }, []);

  // 🔥 Récupération vendeuses Firestore
  useEffect(() => {
    const loadVendors = async () => {
      if (!userLoc) return;

      setLoading(true);
      try {
        // 🔄 Fetch avec revalidation côté serveur
        const vendors = await fetchVendorsAction(userLoc, radiusKm, search);
        setVendors(vendors);
        console.log("toute les vendeuses :");
        console.log(vendors);
      } catch (err) {
        console.error("Erreur lors de la récupération des vendeuses :", err);
        setError("Impossible de charger les vendeuses");
      } finally {
        setLoading(false);
      }
    };

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
                    <Loader
                      size="xs"
                      variant="spinner"
                      label="Récupération…"
                      labelPosition="right"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Liste vendeuses */}
          {loading ? (
            <Skeleton />
          ) : vendors.length === 0 ? (
            <div className="text-center py-8">
              Aucune vendeuse trouvée dans ce rayon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor as Vendor & { distanceKm?: number }}
                />
              ))}
            </div>
          )}
        </div>
      </Wrapper>
    </ProtectedPage>
  );
}
