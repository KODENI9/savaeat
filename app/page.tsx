"use client"; // 🔹 Toujours en tout premier
import { redirect } from "next/navigation";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ScreenshotsSection from "./components/ScreenshotsSection";
import FeaturesSection from "./components/FeacturesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import { verifySession } from "@/src/services/verifySession";
import ScrollAnimations from "./components/ScrollAnimations";
import { useEffect } from "react";

export default function Home() {
  // 🔹 On crée une fonction pour vérifier la session
  const checkSession = async () => {
    const user = await verifySession();
    if (!user) {
      redirect("/home"); // renvoie vers la landing si pas connecté
    }
  };

  useEffect(() => {
    checkSession();
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <ScrollAnimations />
      <Header />
      <HeroSection />
      <ScreenshotsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

