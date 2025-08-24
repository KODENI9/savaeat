"use client";           // 🔹 Toujours en tout premier

export const dynamic = "force-dynamic"; // ensuite seulement

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase/firebase";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { Client } from "@/src/types";
import Wrapper from "../components/Wrapper";
import Loader from "../components/Loader";
import { fetchClientByIdAction } from "@/src/services/action";
export default function ClientProfilePage() {
  const auth = getAuth();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  // 🔹 On récupère l'utilisateur côté client
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        const clientId = user.uid;
        const data = await fetchClientByIdAction(clientId);
        if (data) {
          setClient(data);
          setForm({ name: data.name, email: data.email });
        }
      } catch (error) {
        console.error("Erreur récupération client:", error);
        
      }
    };

    fetchClient();
  }, [auth]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "clients", user.uid), {
        name: form.name,
        email: form.email,
      });
      setClient((prev) => (prev ? { ...prev, ...form } : null));
      setEditMode(false);
      alert("Profil mis à jour avec succès ✅");
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      alert("Impossible de mettre à jour le profil.");
    }
  };

  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!auth.currentUser) return <p className="text-center mt-10">Veuillez vous connecter.</p>;
  if (!client) return <p className="text-center mt-10">Aucun client trouvé.</p>;

  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto p-8">
        {/* Banner */}
        <div className="relative w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg">
          {client.bannerImageUrl && (
            <Image
              src={client.bannerImageUrl}
              alt="Profile banner"
              className="object-cover w-full h-full opacity-90"
              fill
              sizes="100vw"
              priority
            />
          )}
        </div>

        {/* Profile Section */}
        <div className="relative px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 -mt-16">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-xl">
              {client.profileImageUrl ? (
                <Image
                  src={client.profileImageUrl}
                  alt={`${client.name}'s profile picture`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">
                    {client.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {editMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input input-bordered w-full max-w-md text-lg"
                    placeholder="Votre nom"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input input-bordered w-full max-w-md"
                    placeholder="Votre email"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  <p className="text-gray-600 mt-1">{client.email}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="md:self-end">
              {editMode ? (
                <div className="flex gap-3">
                  <button onClick={handleSave} className="btn btn-primary btn-md">
                    Enregistrer
                  </button>
                  <button onClick={() => setEditMode(false)} className="btn btn-ghost btn-md">
                    Annuler
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditMode(true)} className="btn btn-outline btn-md">
                  Modifier le profil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
