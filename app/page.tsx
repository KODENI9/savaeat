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

export default async function Home() {
  const user = await verifySession();

  if (!user) {
    redirect("/home"); // renvoie vers la landing si pas connecté
  }
  useEffect(() => {
    // Add scroll-based animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements with fade-in animations
    const animatedElements = document.querySelectorAll('.animate-fade-in-up');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ScreenshotsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

