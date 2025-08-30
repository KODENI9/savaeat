"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/src/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Wrapper from "../components/Wrapper";
import Loader from "../components/Loader";
import { fetchVendorByIdAction, saveVendorAction } from "@/src/services/action";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function VendorProfilePage() {
  const auth = getAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [profileChanged, setProfileChanged] = useState(false);
  const [bannerChanged, setBannerChanged] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setVendorId(user.uid);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

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
        if (field === "profileImageUrl") setProfileChanged(true);
        else setBannerChanged(true);
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
      setProfileChanged(false);
      setBannerChanged(false);
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      alert("Impossible de mettre à jour le profil ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!vendor) return <p className="text-center mt-10">⚠️ Vendeur introuvable ou non connecté.</p>;

  return (
    <Wrapper>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-5">
        {/* Bannière */}
        <div className="relative h-32 bg-gray-200 overflow-hidden">
          <Image
            src={vendor.bannerImageUrl || "/default-banner.jpg"}
            alt="Bannière"
            fill
            className={`object-cover transition-transform duration-500 ease-in-out ${
              bannerChanged ? "scale-105 opacity-80" : "scale-100 opacity-100"
            }`}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "bannerImageUrl")}
            className="absolute bottom-2 right-2 bg-white rounded px-2 py-1 text-sm cursor-pointer shadow"
          />
        </div>

        {/* Photo de profil */}
        <div className="flex justify-center -mt-12">
            <div className="relative">
            <Image
              src={vendor.profileImageUrl || "/default-avatar.jpg"}
              alt="Profil"
              width={96}
              height={96}
              className={`rounded-full border-4 border-white object-cover transition-transform duration-500 ease-in-out ${
              profileChanged ? "scale-110 opacity-80" : "scale-100 opacity-100"
              }`}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "profileImageUrl")}
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
            />
            </div>
        </div>

        {/* Infos du vendor */}
        <div className="px-6 py-4 space-y-4">
          {["name", "description"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-gray-500 text-sm font-medium capitalize">{field}</label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={(vendor as any)[field] || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={(vendor as any)[field] || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
              )}
              <PencilIcon className="w-5 h-5 text-gray-400 absolute right-2 top-9 pointer-events-none" />
            </div>
          ))}

          <div>
            <label className="block text-gray-500 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={vendor.email}
              className="w-full mt-1 p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={updating}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {updating ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
