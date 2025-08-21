"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase/firebase";
import { Vendor } from "@/src/types";
import { getAuth } from "firebase/auth";
import Wrapper from "../components/Wrapper";
import Image from "next/image";
import Loader from "../components/Loader";

export default function VendorProfilePage() {
  const auth = getAuth();
  const vendorId = auth.currentUser?.uid; 

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!vendorId) return;

    const fetchVendor = async () => {
      const docRef = doc(db, "vendors", vendorId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setVendor(snapshot.data() as Vendor);
      }
      setLoading(false);
    };

    fetchVendor();
  }, [vendorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!vendor) return;
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "profileImageUrl" | "bannerImageUrl") => {
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
      await updateDoc(doc(db, "vendors", vendorId), { ...vendor });
      alert("Profil mis à jour avec succès ✅");
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
    }
    setUpdating(false);
  };

  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!vendor) return <p className="text-center">Vendeuse introuvable</p>;

  return (
    <Wrapper>
    <div className="max-w-3xl mx-auto p-6 space-y-8">
  {/* Banner */}
  <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-md">
    {vendor.bannerImageUrl ? (
      <Image
      src={vendor.bannerImageUrl}
      alt="Bannière"
      fill
      className="object-cover"
      priority
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
      Ajouter une bannière
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "bannerImageUrl")}
      className="file-input file-input-bordered file-input-sm absolute bottom-3 right-3"
    />
  </div>

  {/* Profile image */}
  <div className="relative -mt-20 flex justify-center">
    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
      {vendor.profileImageUrl ? (
        <Image
          src={vendor.profileImageUrl}
          alt="Profil"
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          Photo
        </div>
      )}
    </div>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "profileImageUrl")}
      className="file-input file-input-bordered file-input-sm absolute bottom-0 right-[40%]"
    />
  </div>

  {/* Form */}
  <div className="space-y-4">
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

  {/* Save button */}
  <div>
    <button
      onClick={handleSave}
      disabled={updating}
      className="btn btn-primary w-full rounded-xl shadow-md"
    >
      {updating ? "Mise à jour..." : "Enregistrer les modifications"}
    </button>
  </div>
</div>
</Wrapper>

  );
}
