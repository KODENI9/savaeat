"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ScreenshotsSection from "./components/ScreenshotsSection";
import FeaturesSection from "./components/FeacturesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import { verifySession } from "@/src/services/verifySession";
import ScrollAnimations from "./components/ScrollAnimations";

export default async function Home() {
  const user = await verifySession();

  if (!user) {
    redirect("/home"); // renvoie vers la landing si pas connecté
  }


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

