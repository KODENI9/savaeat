"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, MessageCircle, Search, CookingPot } from 'lucide-react';

const screenshots = [
  {
    id: 1,
    title: "Découverte",
    description: "Explorez les vendeuses près de chez vous avec notre carte interactive",
    image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop",
    features: ["Géolocalisation", "Filtres avancés", "Vue carte/liste"]
  },
  {
    id: 2,
    title: "Profils détaillés",
    description: "Consultez les avis, photos et spécialités de chaque vendeuse",
    image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop",
    features: ["Notes et avis", "Photos des plats", "Horaires d'ouverture"]
  },
  {
    id: 3,
    title: "Communication",
    description: "Contactez directement les vendeuses via WhatsApp",
    image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop",
    features: ["Chat intégré", "Commandes rapides", "Suivi en temps réel"]
  }
];

const ScreenshotsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Découvrez l'application en action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une interface intuitive conçue pour vous connecter facilement avec les meilleures vendeuses de votre quartier
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Phone mockup with carousel */}
          <div className="flex justify-center animate-fade-in-up">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-80 h-[640px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Status bar */}
                  <div className="bg-gray-900 h-8 flex items-center justify-between px-6 text-white text-xs">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                      <div className="w-6 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>

                  {/* App header */}
                  <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-orange-500 font-bold text-sm">
                            <CookingPot className='h-6 w-6 text-orange-500' />
                        </span>
                      </div>
                      <span className="text-white font-semibold">Savaeat</span>
                    </div>
                    <Search className="w-5 h-5 text-white" />
                  </div>

                  {/* Dynamic content based on active screenshot */}
                  <div className="p-6 h-full">
                    {activeIndex === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">Près de vous</span>
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-500">4.{8-i}</span>
                                  <span className="text-xs text-orange-500 ml-2">{Math.floor(Math.random() * 500) + 100}m</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeIndex === 1 && (
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-3"></div>
                          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                          <div className="flex justify-center items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">4.9 (127 avis)</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-300 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    )}

                    {activeIndex === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Conversation</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-end">
                            <div className="bg-orange-500 text-white p-3 rounded-lg rounded-br-none max-w-xs">
                              <p className="text-sm">Bonjour, avez-vous du riz au gras aujourd'hui ?</p>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-xs">
                              <p className="text-sm">Oui ! Il me reste 3 portions. Vous voulez réserver ?</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-orange-500 text-white p-3 rounded-lg rounded-br-none max-w-xs">
                              <p className="text-sm">Parfait ! Je réserve 1 portion</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {screenshots[activeIndex].title}
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {screenshots[activeIndex].description}
              </p>
              
              <div className="space-y-3">
                {screenshots[activeIndex].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex space-x-2 mb-8">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === activeIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105">
              Télécharger l'app
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;