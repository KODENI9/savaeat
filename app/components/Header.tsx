"use client";
import React, { useState, useEffect } from "react";
import { CookingPot } from "lucide-react";
import Link from "next/link";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gray-900 rounded-full p-2">
              <CookingPot className="h-6 w-6 text-orange-500" />
            </div>
            <span className="ml-3 font-bold text-2xl italic">
              Sa<span className="text-accent">vaEat</span>
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              Accéder à l'app
            </Link>

            <Link
              href="https://chat.whatsapp.com/Kfp0U8toIYLLu81ROo0XNb" // mets ton lien WhatsApp ici
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
            >
              Groupe WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
