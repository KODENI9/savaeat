"use client";
import { CookingPot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "./UserButton";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  AiFillHome,
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineStar,
} from "react-icons/ai";

export default function Navbar() {
  const pathname = usePathname();
  const [profileHref, setProfileHref] = useState("/clientProfile");
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fermeture drawer au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfileHref("/login");
        return;
      }
      const vendorDoc = await getDoc(doc(db, "vendors", user.uid));
      if (vendorDoc.exists()) {
        setProfileHref(`/vendorProfile/`);
      } else {
        const clientDoc = await getDoc(doc(db, "clients", user.uid));
        if (clientDoc.exists()) {
          setProfileHref(`/clientProfile/`);
        } else {
          setProfileHref("/");
        }
      }
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { href: "/home", label: "Accueil", icon: <AiFillHome size={28} /> },
    { href: profileHref, label: "Profile", icon: <AiOutlineUser size={28} /> },
    {
      href: "/favorites",
      label: "Favoris",
      icon: <AiOutlineHeart size={28} />,
    },
    { href: "/panier", label: "Avis", icon: <AiOutlineStar size={28} /> },
  ];

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  return (
    <>
      {/* Navbar PC / Tablet */}
      <div className="hidden md:block border-b border-base-300 px-5 md:px-[10%] py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-accent-content text-accent rounded-full p-2">
              <CookingPot className="h-6 w-6" />
            </div>
            <span className="ml-3 font-bold text-2xl italic">
              Sa<span className="text-accent">vaEat</span>
            </span>
          </div>
          <div className="flex space-x-2 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`btn btn-sm ${
                  isActiveLink(href) ? "btn-accent" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <UserButton />
          </div>
        </div>
      </div>

      {/* Mobile AppBar */}
      <div className="fixed top-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-4 py-2 md:hidden">
        <div className="flex items-center">
          <div className="bg-accent-content text-accent rounded-full p-2">
            <CookingPot className="h-6 w-6" />
          </div>
          <span className="ml-2 font-bold text-xl italic">
            Sa<span className="text-accent">vaEat</span>
          </span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <AiOutlineMenu size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end">
          <div
            ref={drawerRef}
            className="bg-white w-2/3 max-w-xs h-full p-6 flex flex-col justify-center space-y-6 animate-slide-right rounded-l-xl"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`p-3 rounded-lg text-lg font-medium text-center ${
                  isActiveLink(href)
                    ? "bg-accent text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 w-full mt-30 bg-white shadow-t z-50 flex justify-around md:hidden p-2">
        {navLinks.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center text-sm relative group"
          >
            <span
              className={`transition-transform duration-200 ${
                isActiveLink(href)
                  ? "text-accent scale-125"
                  : "text-gray-500 group-hover:scale-110"
              }`}
            >
              {icon}
            </span>
            <span
              className={`text-xs mt-1 transition-colors duration-200 ${
                isActiveLink(href)
                  ? "text-accent font-semibold"
                  : "text-gray-500"
              }`}
            >
              {label}
            </span>
            {isActiveLink(href) && (
              <span className="absolute -top-1 w-2 h-2 bg-accent rounded-full animate-bounce"></span>
            )}
          </Link>
        ))}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes slide-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slide-right {
          animation: slide-right 0.3s ease-out forwards;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </>
  );
}
