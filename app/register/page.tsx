"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/firebase/firebase";

type Role = "client" | "vendor";

const MAX_IMAGE_BYTES = 1_000_000; // ~1MB

async function fileToDataURL(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image trop lourde (max 1 Mo).");
  }
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // commun
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // images
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");

  // vendor-only
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const pickProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setProfileImageUrl(await fileToDataURL(f));
    } catch (err: any) {
      setError(err.message || "Erreur image");
    }
  };

  const pickBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setBannerImageUrl(await fileToDataURL(f));
    } catch (err: any) {
      setError(err.message || "Erreur image");
    }
  };

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("La géolocalisation n’est pas supportée.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocLoading(false);
      },
      () => {
        setError("Impossible d’obtenir la position.");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // validations minimales
    if (!name || !email || !password) {
      setError("Remplis tous les champs requis.");
      return;
    }
    if (!profileImageUrl || !bannerImageUrl) {
      setError("Profile & bannière sont obligatoires.");
      return;
    }
    if (role === "vendor") {
      if (!shopName || !address || !phoneNumber) {
        setError("Boutique, adresse et téléphone sont requis.");
        return;
      }
      if (latitude == null || longitude == null) {
        setError("Position GPS requise pour une vendeuse.");
        return;
      }
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const createdAt = Date.now();

      if (role === "vendor") {
        const vendorDoc = {
          id: uid,
          name,
          email,
          profileImageUrl,
          bannerImageUrl,
          shopName,
          address,
          latitude,
          longitude,
          phoneNumber,
          likedByClients: [] as string[],
          averageRating: 0,
          ratingsCount: 0,
          createdAt,
        };
        await setDoc(doc(db, "vendors", uid), vendorDoc);
      } else {
        const clientDoc = {
          id: uid,
          name,
          email,
          profileImageUrl,
          bannerImageUrl,
          favoriteVendorIds: [] as string[],
          reviewIds: [] as string[],
          createdAt,
        };
        await setDoc(doc(db, "clients", uid), clientDoc);
      }

      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("Erreur à l’inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 w-full max-w-2xl p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Créer un compte</h1>

        {/* Onglets rôle */}
        <div className="tabs tabs-boxed justify-center mb-6">
          <button
            className={`tab ${role === "client" ? "tab-active" : ""}`}
            onClick={() => setRole("client")}
          >
            Client
          </button>
          <button
            className={`tab ${role === "vendor" ? "tab-active" : ""}`}
            onClick={() => setRole("vendor")}
          >
            Vendeuse
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Commun */}
          <input
            className="input input-bordered w-full"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Photo de profil</label>
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
                     onChange={pickProfile} />
              {profileImageUrl && (
                <img src={profileImageUrl} alt="Profil" className="mt-2 h-24 w-24 rounded-lg object-cover border" />
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Bannière</label>
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
                     onChange={pickBanner} />
              {bannerImageUrl && (
                <img src={bannerImageUrl} alt="Bannière" className="mt-2 h-24 w-full rounded-lg object-cover border" />
              )}
            </div>
          </div>

          {/* Vendor-only */}
          {role === "vendor" && (
            <>
              <input
                className="input input-bordered w-full"
                placeholder="Nom de la boutique"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
              <input
                className="input input-bordered w-full"
                placeholder="Adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <input
                className="input input-bordered w-full"
                placeholder="Téléphone (WhatsApp conseillé)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <button
                  type="button"
                  className={`btn btn-outline btn-accent ${locLoading ? "loading" : ""}`}
                  onClick={detectLocation}
                >
                  📍 {locLoading ? "Détection..." : "Détecter ma position"}
                </button>
                <input
                  className="input input-bordered w-full"
                  placeholder="Latitude"
                  value={latitude ?? ""}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Longitude"
                  value={longitude ?? ""}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                />
              </div>

              {latitude != null && longitude != null && (
                <p className="text-xs text-gray-500">
                  GPS détecté : {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </p>
              )}
            </>
          )}

          <button
            type="submit"
            className={`btn btn-accent w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
