"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/src/firebase/firebase";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Wrapper from "@/app/components/Wrapper";
import VendorMap from "@/app/components/VendorMap";
import Loader from "@/app/components/Loader";
import { Client, Review, Vendor } from "@/src/types";
import {
  addReviewAction,
  fetchReviewsWithUsers,
  toggleLikeAction,
} from "@/src/services/action";
import ReviewCard from "@/app/components/ReviewCard";

export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

    const loadReviews = async () => {
      if (!vendorId) return;
      console.log("Loading reviews for vendorId:", vendorId);
      setLoading(true);
      try {
        if (vendorId) {
          const res = await fetchReviewsWithUsers(vendorId);
          setReviews(res); // reviews avec client complet
        }
      } catch (error) {
        console.error("Erreur chargement reviews:", error);
      } finally {
        setLoading(false);
      }
    };

  // --- Auth listener ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUserId(u.uid);
        setClientName(u.displayName || u.email?.split("@")[0] || "Client");
      } else {
        setUserId(null);
        setClientName("");
      }
    });
    return () => unsub();
  }, []);

  // --- Real-time vendor + reviews ---
  useEffect(() => {
    if (!vendorId) return;

    setLoading(true);

    const vendorRef = doc(db, "vendors", vendorId);
    
    const unsubVendor = onSnapshot(vendorRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Omit<Vendor, "id">; // ✅ typage fort
        setVendor({
          id: snap.id,
          ...data,
        });
      } else {
        setVendor(null);
      }
    });
    return () => {
      unsubVendor();
    };
  }, [vendorId]);

useEffect(() => {
  loadReviews();
}, [vendorId]);


  const averageComputed = useMemo(() => {
    if (!reviews.length) return vendor?.averageRating ?? 0;
    const total = reviews.reduce((s, r) => s + Number(r.rating || 0), 0);
    return total / reviews.length;
  }, [reviews, vendor?.averageRating]);

  const likedCount = vendor?.likedByClients?.length || 0;
  const isLiked = userId ? vendor?.likedByClients?.includes(userId) : false;

  // --- Like / Unlike ---
  const toggleLike = async () => {
    if (!userId) {
      alert("Connectez-vous pour aimer cette vendeuse.");
      return;
    }
    await toggleLikeAction(vendorId, userId);
  };

  // --- Publier un avis ---
  const submitReview = async () => {
    if (!userId) {
      alert("Connectez-vous pour laisser un avis.");
      return;
    }
    if (!rating || !comment.trim()) {
      alert("Note et commentaire requis.");
      return;
    }

    setSending(true);
    try {
      await addReviewAction(vendorId, userId, clientName, rating, comment);
      setRating(0);
      setComment("");
      await loadReviews();
    } catch (e) {
      console.error("Erreur ajout avis:", e);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!vendor)
    return <div className="text-center py-8">Vendeuse introuvable.</div>;

  return (
    <Wrapper>
      <div className="max-w-3xl mx-auto p-4">
        {/* Bannière */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={vendor.bannerImageUrl || "/banner-placeholder.jpg"}
            alt="Bannière"
            fill
            className="object-cover brightness-90"
            priority
          />

          {/* Bouton like */}
          <button
            onClick={toggleLike}
            className={`absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-200 cursor-pointer
    ${
      isLiked
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-white text-red-500 border border-red-300 hover:bg-red-50"
    }`}
            title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <span className="text-xl">❤</span>
            <span className="text-sm font-semibold">{likedCount}</span>
          </button>
        </div>

        {/* Profil + Infos vendeur */}
        <div className="flex flex-col items-center -mt-14 px-4 relative z-10">
          <Image
            src={vendor.profileImageUrl || "/placeholder.png"}
            alt={vendor.name}
            width={120}
            height={120}
            className="rounded-full ring-4 ring-white object-cover shadow-2xl"
          />

          <div className="mt-4 text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {vendor.shopName || vendor.name}
            </h1>
            <p className="text-sm text-gray-600">{vendor.name}</p>
            {/* {vendor.description && (
      <p className="text-sm text-gray-500 mt-2 max-w-md">{vendor.description}</p>
    )} */}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={
                  i <= Math.round(averageComputed)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
            <span className="font-semibold">
              {averageComputed ? averageComputed.toFixed(1) : "—"}
            </span>
            <span className="text-gray-500 ml-1">
              ({vendor.ratingsCount ?? reviews.length} avis)
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="card bg-white shadow-md rounded-xl p-4 mt-4 text-gray-700 text-sm">
          <p>
            {vendor.description ||
              "Spécialités traditionnelles préparées avec des ingrédients frais et locaux."}
          </p>
        </div>
        {/* Infos */}
        <div className="card bg-white shadow-md rounded-xl p-4 mt-4 text-gray-700 text-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-orange-500">📍</span>
            <span>
              <b>Adresse :</b> {vendor.address || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-500">⏰</span>
            <span>
              <b>Horaires :</b> 7h00 - 22h00
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-500">📞</span>
            <span>
              <b>Téléphone :</b> {vendor.phoneNumber || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Formulaire avis */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Laisser un avis</h2>
        <div className="card bg-base-100 shadow p-4">
          <label className="block text-sm mb-1">Note</label>
          <div className="flex gap-1 text-2xl mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="hover:scale-110 transition"
                aria-label={`note ${s}`}
              >
                <span
                  className={s <= rating ? "text-yellow-500" : "text-gray-300"}
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Partagez votre expérience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <button
            onClick={submitReview}
            disabled={sending}
            className={`btn btn-accent mt-3 w-full ${sending ? "loading" : ""}`}
          >
            {sending ? "Publication..." : "Publier l'avis"}
          </button>
        </div>
      </div>
      {/* Carte Google Maps */}
      {vendor.latitude && vendor.longitude && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Localisation</h2>
          <VendorMap lat={vendor.latitude} lng={vendor.longitude} />
        </div>
      )}
      {/* Liste avis */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Avis des clients ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <div className="text-gray-500">Aucun avis pour le moment.</div>
        ) : (
          <div className="space-y-3">
            {reviews
              .slice()
              .sort((a, b) => {
                const ta =
                  a.createdAt instanceof Timestamp
                    ? a.createdAt.seconds * 1000
                    : new Date(a.createdAt).getTime() || 0;
                const tb =
                  b.createdAt instanceof Timestamp
                    ? b.createdAt.seconds * 1000
                    : new Date(b.createdAt).getTime() || 0;
                return tb - ta;
              })
              .map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
