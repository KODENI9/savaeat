"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/firebase/firebase";
import { Vendor, Client } from "@/src/types";

type UserType = "client" | "vendor" | null;

interface CurrentUser {
  _userId: string | null;
  userType: UserType;
  data: Vendor | Client | null;
  _loading: boolean;
}

export function useCurrentUser(): CurrentUser {
  const [state, setState] = useState<CurrentUser>({
    _userId: null,
    userType: null,
    data: null,
    _loading: true,
  });

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (!user) {
        setState({ _userId: null, userType: null, data: null, _loading: false });
        return;
      }

      const uid = user.uid;

      // Vérifie d’abord dans vendors
      const vendorDoc = await getDoc(doc(db, "vendors", uid));
      if (vendorDoc.exists()) {
        setState({
          _userId: uid,
          userType: "vendor",
          data: { id: uid, ...vendorDoc.data() } as Vendor,
          _loading: false,
        });
        return;
      }

      // Vérifie sinon dans clients
      const clientDoc = await getDoc(doc(db, "clients", uid));
      if (clientDoc.exists()) {
        setState({
          _userId: uid,
          userType: "client",
          data: { id: uid, ...clientDoc.data() } as Client,
          _loading: false,
        });
        return;
      }

      // Si trouvé nulle part
      setState({ _userId: uid, userType: null, data: null, _loading: false });
    });

    return () => unsubscribe();
  }, []);

  return state;
}
