"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/src/firebase/firebase";
import { fetchUserByIdAction } from "@/src/services/action";

interface UserData {
  name: string;
  email: string;
  profileImageUrl?: string;
}

export default function UserButton() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("UserButton mounted");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
      console.log("onAuthStateChanged triggered", currentUser);

      if (!currentUser) {
        console.log("Aucun utilisateur connecté");
        setUser(null);
        return;
      }

      try {
        let data: UserData | null = null;

        console.log("Vérification si l'utilisateur est un vendeur...");
        console.log("id :", currentUser.email)
        const vendorDoc = await getDoc(doc(db, "vendors", currentUser.uid));

        if (vendorDoc.exists()) {
          console.log("C'est un vendeur", vendorDoc.data());
          data = (await fetchUserByIdAction(currentUser.uid, "vendor")) as UserData;
          console.log("fetchUserByIdAction vendeur:", data);
        } else {
          console.log("Pas un vendeur, vérification client...");
          const clientDoc = await getDoc(doc(db, "clients", currentUser.uid));
          if (clientDoc.exists()) {
            console.log("C'est un client", clientDoc.data());
            data = (await fetchUserByIdAction(currentUser.uid, "client")) as UserData;
          } else {
            console.log("Aucun document client trouvé");
          }
        }

        if (data) {
          console.log("Données utilisateur récupérées :", data);
          setUser(data);
        } else {
          console.log("Aucune donnée utilisateur trouvée");
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    console.log("Déconnexion...");
    await signOut(auth);
    router.push("/login");
  };

  console.log("User state actuel :", user);

  if (!user) {
    console.log("Pas d'utilisateur à afficher → return null");
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src={user.profileImageUrl || "/default-avatar.png"} alt="Profil" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
      >
        <li>
          <a className="font-bold">
            {user.name}
          </a>
        </li>
        <li>
          <a  className="text-sm opacity-70">
            {user.email}
          </a>
        </li>
        <li>
          <button onClick={handleLogout} className="text-error w-full text-left">
            Se déconnecter
          </button>
        </li>
      </ul>
    </div>
  );
}
