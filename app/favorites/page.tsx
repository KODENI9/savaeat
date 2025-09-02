"use client";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Wrapper from "../components/Wrapper";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { fetchVendorByIdAction, toggleLikeAction } from "@/src/services/action";
import { Vendor } from "@/src/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function FavoritesPage() {
  const router = useRouter();
  const { _userId, userType, data } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [favoriteVendors, setFavoriteVendors] = useState<(Vendor | null)[]>([]);

  useEffect(() => {
    if (!data?.favoriteVendors?.length) return;

    const fetchFavorites = async () => {
      const _favoriteVendors = await Promise.all(
        data.favoriteVendors.map((id: string) => fetchVendorByIdAction(id))
      );

      setFavoriteVendors(_favoriteVendors.filter(Boolean));
    };

    fetchFavorites();
  }, [_userId, userType, data]);

  // 🔍 Recherche locale
  const filteredFavorites = favoriteVendors.filter((fav) =>
    fav?.name.toLowerCase().includes(search.toLowerCase())
  );

  // 💔 Retirer un vendeur des favoris
  const handleToggleFavorite = async (vendorId: string) => {
    if (!_userId || !userType) return;
    await toggleLikeAction(vendorId, _userId, userType);

    // Met à jour l’UI en local
    setFavoriteVendors((prev) =>
      prev.filter((fav) => fav?.id !== vendorId)
    );
  };

  return (
    <Wrapper>
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mes Favoris</h1>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher dans vos favoris..."
          className="input input-bordered w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h2 className="font-semibold mb-3">
          {filteredFavorites.length} favoris
        </h2>

        {filteredFavorites.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun favori pour l’instant.</p>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((fav) => (
              <div
                key={fav?.id}
                className="card card-bordered bg-base-100 shadow-sm p-4 flex flex-col"
              >
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                    <Image
                      src={fav?.profileImageUrl || '/default-profile.png'}
                      alt={fav?.name || 'Profile image'}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{fav?.name}</h3>
                      <p className="text-sm text-gray-500">
                      {fav?.description && fav.description.length > 60
                        ? fav.description.slice(0, 60) + "..."
                        : fav?.description}
                      </p>
                    </div>
                    </div>
                  <FaHeart
                    className="w-8 h-8 text-orange-500 cursor-pointer hover:scale-110 transition"
                    onClick={() => handleToggleFavorite(fav!.id)}
                  />
                </div>

                <div className="flex items-center mt-3 space-x-2 text-sm">
                  <div className="flex">✨</div>
                  <span className="font-medium">
                    {fav?.averageRating ?? 0} / 5
                  </span>
                  <span>•</span>
                  <span>{fav?.ratingsCount ?? 0} avis</span>
                </div>

                <button 
                onClick={() => router.push(`/vendeuses/${fav?.id}`)}
                className="btn btn-accent btn-sm mt-3 w-fit">
                  Voir le profil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
