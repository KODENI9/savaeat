import Image from "next/image";
import { Vendor } from "@/src/types";
import { useRouter } from "next/navigation";

const VendorCard: React.FC<{ vendor: Vendor & { distanceKm?: number } }> = ({ vendor }) => {
  const router = useRouter();

  return (
    <div
      key={vendor.id}
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
    >
      {/* Image bannière si dispo */}
      {vendor.bannerImageUrl && (
        <Image
          src={vendor.bannerImageUrl}
          alt={`Bannière de ${vendor.shopName}`}
          width={600}
          height={96}
          className="w-full h-24 object-cover"
          style={{ objectFit: "cover" }}
          priority={false}
        />
      )}

      <div className="flex gap-4 p-5 items-center">
        <Image
          src={vendor.profileImageUrl}
          alt={vendor.name}
          width={96}
          height={96}
          className="w-24 h-24 rounded-xl object-cover ring-1 ring-gray-200"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
          }}
        />

        <div className="flex-1">
          {/* Nom + Adresse + Étoiles */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{vendor.name}</h3>
              <p className="text-sm text-gray-500">
                {vendor.address || "Adresse non renseignée"}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                ⭐ {vendor.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="text-xs text-gray-400">{vendor.ratingsCount} avis</div>
            </div>
          </div>

          {/* Distance + Bouton */}
          <div className="mt-3 flex items-center justify-between">
            <div className="badge badge-soft badge-accent">{vendor.distanceKm?.toFixed(2)} km</div>
            <button
              className="btn btn-sm btn-accent rounded-full px-4 shadow-md hover:shadow-lg transition"
              onClick={() => router.push(`/vendeuses/${vendor.id}`)}
            >
              Voir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
