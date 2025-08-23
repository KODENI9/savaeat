"use client";
import { CookingPot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "./UserButton";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
    const pathname = usePathname();
    const [profileHref, setProfileHref] = useState("/clientProfile");

      useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfileHref("/login"); // si pas connecté
        return;
      }

      // Vérifie si c'est un vendeur ou un client
      const vendorDoc = await getDoc(doc(db, "vendors", user.uid));
      if (vendorDoc.exists()) {
        setProfileHref(`/vendorProfile/`);
      } else {
        const clientDoc = await getDoc(doc(db, "clients", user.uid));
        if (clientDoc.exists()) {
          setProfileHref(`/clientProfile/`);
        } else {
          setProfileHref("/"); // fallback
        }
      }
    });
    return () => unsub();
  }, []);


    const navLinks = [
        {href: "/" , label: "Accueil"},
        {href: profileHref , label: "Profile"},
    ]
    const isActiveLink = (href: string) =>
        pathname.replace(/\/$/, "")=== href.replace(/\/$/, ""); 

    const renderLinks = (classNames: string) =>
        navLinks.map(({ href, label }) => {
            return <Link href={href} key={href}
                className={`btn-sm  ${classNames} ${isActiveLink(href) ? 'btn-accent' : ''}`}
            >
                {label}
            </Link>
        })
  return (
    <div>
        <div className='border-b border-base-300 px-5 md:px-[10%] py-4'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <div className='bg-accent-content text-accent  rounded-full p-2'>
                        <CookingPot className='h-6 w-6' />
                    </div>
                    <span className='ml-3 font-bold text-2xl italic'>
                        Sa<span className='text-accent'>vaEat</span>
                    </span>
                </div>
               
                <div className='flex  space-x-4 items-center'>
                    {renderLinks("btn")}
                    <UserButton />
                </div>
            </div>

            <div></div>
        </div>
    </div>
  );
}
