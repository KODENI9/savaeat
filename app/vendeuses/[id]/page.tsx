"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/src/firebase/firebase";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { addReview } from "@/src/services/addReview.ts";
import { _toggleLike } from "@/src/services/toggleLike";


type Vendor = {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  bannerImageUrl: string;
  shopName: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  likedByClients: string[];
  averageRating?: number;
  ratingsCount?: number;
};

type Review = {
  id: string;
  clientId: string;
  clientName: string;
  vendorId: string;
  rating: number;
  comment: string;
  createdAt: any;
};

export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  // --- Auth listener ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setClientId(u.uid);
        setClientName(u.displayName || u.email?.split("@")[0] || "Client");
      } else {
        setClientId(null);
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
    const reviewsQuery = query(collection(db, "reviews"), where("vendorId", "==", vendorId));

    const unsubVendor = onSnapshot(vendorRef, (snap) => {
      if (snap.exists()) {
        setVendor({
          id: snap.id,
          likedByClients: [],
          averageRating: 0,
          ratingsCount: 0,
          ...(snap.data() as any),
        });
      } else {
        setVendor(null);
      }
    });

    const unsubReviews = onSnapshot(reviewsQuery, (snap) => {
      const list: Review[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setReviews(list);
      setLoading(false);
    });

    return () => {
      unsubVendor();
      unsubReviews();
    };
  }, [vendorId]);

  const averageComputed = useMemo(() => {
    if (!reviews.length) return vendor?.averageRating ?? 0;
    const total = reviews.reduce((s, r) => s + Number(r.rating || 0), 0);
    return total / reviews.length;
  }, [reviews, vendor?.averageRating]);

  const likedCount = vendor?.likedByClients?.length || 0;
  const isLiked = clientId ? vendor?.likedByClients?.includes(clientId) : false;

  // --- Like / Unlike ---
  const toggleLike = async () => {
    if (!clientId) {
      alert("Connectez-vous pour aimer cette vendeuse.");
      return;
    }
    try {
      await _toggleLike(vendorId, clientId);
    } catch (e) {
      console.error("Erreur like/unlike:", e);
    }
  };

  // --- Publier un avis ---
  const submitReview = async () => {
    if (!clientId) {
      alert("Connectez-vous pour laisser un avis.");
      return;
    }
    if (!rating || !comment.trim()) {
      alert("Note et commentaire requis.");
      return;
    }

    setSending(true);
    try {
      await addReview(vendorId, clientId, clientName, rating, comment);
      setRating(0);
      setComment("");
    } catch (e) {
      console.error("Erreur ajout avis:", e);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement…</div>;
  if (!vendor) return <div className="text-center py-8">Vendeuse introuvable.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Bannière + Like */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-lg">
        <img src={vendor.bannerImageUrl || "/banner-placeholder.jpg"} alt="Bannière" className="w-full h-full object-cover brightness-95" />
        <button
          onClick={toggleLike}
          className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-2 rounded-full shadow-md transition-all duration-200 
          ${isLiked ? "bg-red-500 text-white hover:bg-red-600" : "bg-white text-red-500 border border-red-300 hover:bg-red-50"}`}
          title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <span className="text-lg">❤</span>
          <span className="text-sm font-medium">{likedCount}</span>
        </button>
      </div>

      {/* Profil */}
      <div className="flex items-center gap-4 -mt-12 px-3">
        <div className="relative">
          <img src={vendor.profileImageUrl || "/placeholder.png"} alt={vendor.name} className="w-24 h-24 rounded-full ring-4 ring-white object-cover shadow-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{vendor.shopName || vendor.name}</h1>
          <p className="text-sm text-gray-600">{vendor.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★★★★★</span>
          <span className="font-semibold">{averageComputed ? averageComputed.toFixed(1) : "—"}</span>
          <span className="text-gray-500 ml-1">({vendor.ratingsCount ?? reviews.length} avis)</span>
        </div>
      </div>

      {/* Formulaire avis */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Laisser un avis</h2>
        <div className="card bg-base-100 shadow p-4">
          <label className="block text-sm mb-1">Note</label>
          <div className="flex gap-1 text-2xl mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} className="hover:scale-110 transition" aria-label={`note ${s}`}>
                <span className={s <= rating ? "text-yellow-500" : "text-gray-300"}>★</span>
              </button>
            ))}
          </div>
          <textarea className="textarea textarea-bordered w-full" placeholder="Partagez votre expérience..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
          <button onClick={submitReview} disabled={sending} className={`btn btn-accent mt-3 w-full ${sending ? "loading" : ""}`}>
            {sending ? "Publication..." : "Publier l'avis"}
          </button>
        </div>
      </div>

      {/* Liste avis */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Avis des clients ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="text-gray-500">Aucun avis pour le moment.</div>
        ) : (
          <div className="space-y-3">
            {reviews
              .slice()
              .sort((a, b) => {
                const ta = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime() || 0;
                const tb = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime() || 0;
                return tb - ta;
              })
              .map((r) => (
                <div key={r.id} className="card bg-base-100 shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span>{r.clientName?.[0]?.toUpperCase() || "C"}</span>
                        </div>
                      </div>
                      <div className="font-semibold">{r.clientName}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {r.createdAt?.seconds ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-yellow-500 text-sm mt-1">⭐ {r.rating}/5</div>
                  <div className="text-sm text-gray-700 mt-1">{r.comment}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
