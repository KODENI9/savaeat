"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/src/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Wrapper from "../components/Wrapper";
import Image from "next/image";
import Loader from "../components/Loader";
import { fetchVendorByIdAction, saveVendorAction } from "@/src/services/action";

export default function VendorProfilePage() {
  const auth = getAuth();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  // 🔹 S'assurer qu'on récupère bien l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setVendorId(user.uid);
      } else {
        setLoading(false); // pas de user → on arrête
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // 🔹 Charger le vendor
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
      alert("Profil mis à jour avec succès ✅");
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      alert("Impossible de mettre à jour le profil ❌");
    } finally {
      setUpdating(false);
    }
  };

  // UI
  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!vendor) return <p className="text-center mt-10">⚠️ Vendeur introuvable ou non connecté.</p>;

  return (
<Wrapper>
  <div className="max-w-3xl mx-auto p-6 space-y-8">
    {/* Bannière */}
    <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-lg group">
      {vendor.bannerImageUrl ? (
        <Image
          src={vendor.bannerImageUrl}
          alt="Bannière"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-lg font-medium">
          Ajouter une bannière
        </div>
      )}
      <label className="absolute bottom-3 right-3 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "bannerImageUrl")}
          className="hidden"
        />
        <span className="btn btn-sm btn-outline shadow-md bg-white/80 backdrop-blur rounded-xl">
          Modifier
        </span>
      </label>
    </div>

    {/* Photo de profil */}
    <div className="relative -mt-20 flex justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
        {vendor.profileImageUrl ? (
          <Image
            src={vendor.profileImageUrl}
            alt="Profil"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-medium">
            Photo
          </div>
        )}
      </div>
      <label className="absolute bottom-0 right-[40%] cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "profileImageUrl")}
          className="hidden"
        />
        <span className="btn btn-xs btn-outline shadow-sm bg-white/80 backdrop-blur rounded-lg">
          Modifier
        </span>
      </label>
    </div>

    {/* Formulaire */}
    <div className="card bg-base-100 shadow-xl rounded-2xl p-6 space-y-4">
      <input
        name="name"
        value={vendor.name}
        onChange={handleChange}
        placeholder="Nom complet"
        className="input input-bordered w-full rounded-xl"
      />
      <input
        name="shopName"
        value={vendor.shopName}
        onChange={handleChange}
        placeholder="Nom de la boutique"
        className="input input-bordered w-full rounded-xl"
      />
      <input
        name="phoneNumber"
        value={vendor.phoneNumber}
        onChange={handleChange}
        placeholder="Téléphone"
        className="input input-bordered w-full rounded-xl"
      />
      <textarea
        name="address"
        value={vendor.address}
        onChange={handleChange}
        placeholder="Adresse"
        className="textarea textarea-bordered w-full rounded-xl"
        rows={3}
      />
    </div>

    {/* Bouton enregistrer */}
    <div>
      <button
        onClick={handleSave}
        disabled={updating}
        className="btn btn-primary w-full rounded-xl shadow-lg text-lg"
      >
        {updating ? "Mise à jour..." : "💾 Enregistrer les modifications"}
      </button>
    </div>
  </div>
</Wrapper>

  );
}
