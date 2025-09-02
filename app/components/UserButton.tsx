"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

      const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
      if (!currentUser) {
        setUser(null);
        return;
      }

      try {
        let data: UserData | null = null;
        const vendorDoc = await getDoc(doc(db, "vendors", currentUser.uid));

        if (vendorDoc.exists()) {
          data = (await fetchUserByIdAction(currentUser.uid, "vendor")) as UserData;
        } else {
          const clientDoc = await getDoc(doc(db, "clients", currentUser.uid));
          if (clientDoc.exists()) {
            data = (await fetchUserByIdAction(currentUser.uid, "client")) as UserData;
          } else {
            console.log("Aucun document client trouvé");
          }
        }

        if (data) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };


  if (!user) {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <Image 
            src={user.profileImageUrl || "/default-avatar.png"} 
            alt="Profil"
            width={40}
            height={40}
            className="rounded-full"
          />
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
