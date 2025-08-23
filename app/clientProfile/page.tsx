"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { Client } from "@/src/types";
import Wrapper from "../components/Wrapper";
import Loader from "../components/Loader";

export default function ClientProfilePage() {
  const auth = getAuth();
  const clientId = auth.currentUser?.uid;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });


  // 🔹 fetch client quand user est connu
  useEffect(() => {
    if (!clientId) return

    const fetchClient = async () => {
      const ref = doc(db, "clients", clientId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Client;
        setClient(data);
        setForm({ name: data.name, email: data.email });
      }
      setLoading(false);
    };

    fetchClient();
  }, [clientId]);

  const handleSave = async () => {
    if (!clientId) return;
    const ref = doc(db, "clients", clientId);
    await updateDoc(ref, {
      name: form.name,
      email: form.email,
    });
    setClient((prev) => (prev ? { ...prev, ...form } : null));
    setEditMode(false);
  };

  if (loading) return <Loader fullScreen variant="ring" size="lg" label="Chargement…" />;
  if (!clientId) return <p className="text-center mt-10">Veuillez vous connecter.</p>;
  if (!client) return <p className="text-center mt-10">Aucun client trouvé.</p>;

  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Banner */}
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
