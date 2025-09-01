"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/src/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Wrapper from "../components/Wrapper";
import Image from "next/image";
import Loader from "../components/Loader";
import { fetchVendorByIdAction, saveVendorAction } from "@/src/services/action";
import { Camera, Save, Pencil, X } from "lucide-react";

export default function VendorProfilePage() {
  const auth = getAuth();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // 🔹 Vérifier utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setVendorId(user.uid);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // 🔹 Charger les infos du vendeur
  useEffect(() => {
    if (!vendorId) return;
    const loadVendor = async () => {
      try {
        const data = await fetchVendorByIdAction(vendorId);
        setVendor(data);
      } catch (err) {
        console.error("Erreur récupération vendeur:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVendor();
  }, [vendorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!vendor) return;
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImageUrl" | "bannerImageUrl"
  ) => {
    if (!vendor) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVendor({ ...vendor, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!vendorId || !vendor) return;
    setUpdating(true);
    try {
      await saveVendorAction(vendor, vendorId);
      alert("✅ Profil mis à jour !");
      setEditing(false);
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      alert("❌ Impossible de mettre à jour.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!vendor) return <p className="text-center mt-10">⚠️ Vendeur introuvable.</p>;

  return (
    <Wrapper>
      <div className="max-w-3xl mx-auto p-6 space-y-8">

        {/* Bannière */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md group">
          {vendor.bannerImageUrl ? (
            <Image
              src={vendor.bannerImageUrl}
              alt="Bannière"
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 font-medium">
              Ajouter une bannière
            </div>
          )}

          {editing && (
            <label className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-white/80 text-gray-700 rounded-lg shadow cursor-pointer hover:bg-white transition">
              <Camera className="w-4 h-4" />
              <span>Changer</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "bannerImageUrl")}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Avatar */}
        <div className="relative -mt-20 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
            {vendor.profileImageUrl ? (
              <Image src={vendor.profileImageUrl} alt="Profil" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                Photo
              </div>
            )}
            {editing && (
              <label className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 bg-white/80 rounded-full shadow cursor-pointer hover:bg-white transition">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profileImageUrl")}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Mode lecture seule */}
        {!editing && (
          <div className="card bg-base-100 shadow-lg rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-semibold">{vendor.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Boutique</p>
              <p className="font-semibold">{vendor.shopName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-semibold">{vendor.phoneNumber || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-semibold">{vendor.address || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-semibold">{vendor.description || "—"}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="btn btn-outline w-full mt-4 flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Modifier le profil
            </button>
          </div>
        )}

        {/* Mode édition */}
        {editing && (
          <div className="card bg-base-100 shadow-lg rounded-2xl p-6 space-y-4">
            <div>
              <label className="label">Nom complet</label>
              <input name="name" value={vendor.name} onChange={handleChange} className="input input-bordered w-full rounded-xl" />
            </div>
            <div>
              <label className="label">Nom de la boutique</label>
              <input name="shopName" value={vendor.shopName} onChange={handleChange} className="input input-bordered w-full rounded-xl" />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input name="phoneNumber" value={vendor.phoneNumber} onChange={handleChange} className="input input-bordered w-full rounded-xl" />
            </div>
            <div>
              <label className="label">Adresse</label>
              <textarea name="address" value={vendor.address} onChange={handleChange} className="textarea textarea-bordered w-full rounded-xl" rows={3} />
            </div>
            <div>
  <label className="label">Description</label>
  <textarea
    name="description"
    value={vendor.description || ""}
    onChange={handleChange}
    className="textarea textarea-bordered w-full rounded-xl"
    rows={4}
  />
</div>


            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="btn btn-ghost flex-1 flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="btn btn-accent flex-1 flex items-center gap-2"
              >
                {updating ? "Mise à jour..." : <><Save className="w-4 h-4" /> Enregistrer</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
