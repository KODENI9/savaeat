import React from "react";
import { Smartphone } from "lucide-react";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Découvrez les meilleures vendeuses près de chez vous
              <span className="text-orange-500 ml-2 inline-block animate-bounce">
                🍲
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Savaeat vous aide à trouver les vendeuses de nourriture bien
              notées et proches de chez vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/home"
                className="group px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <span className="relative z-10">Essayer maintenant</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              <a
                href="https://wa.me/22812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-gray-300"
              >
                <span className="flex items-center space-x-2">
                  <span>Rejoindre WhatsApp</span>
                  <span className="text-green-500 group-hover:animate-pulse">
                    📱
                  </span>
                </span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Vendeuses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8★</div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-200">
            <div className="relative">
              <div className="w-80 h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-32 flex items-center justify-center relative">
                    <Smartphone className="h-12 w-12 text-white" />
                    <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="absolute top-4 right-4 text-white text-xs font-medium">
                      9:41
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="h-6 bg-gray-800 rounded w-32"></div>
                      <div className="h-4 bg-orange-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors duration-300"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {i}
                            </span>
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="h-3 bg-gray-300 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, j) => (
                                <div
                                  key={j}
                                  className="w-2 h-2 bg-yellow-400 rounded-full"
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-500 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-orange-500 rounded-full animate-bounce animation-delay-1000 flex items-center justify-center">
                <span className="text-white text-xs">🔥</span>
              </div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
