import React from "react";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à découvrir Savaeat ?
          </h2>

          <p className="text-xl text-orange-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Rejoignez la communauté et trouvez vos vendeuses préférées dès
            maintenant !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Bouton pour accéder à l'app */}
            <Link
              href="/home"
              className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Accéder à l app
            </Link>

            {/* Bouton pour rejoindre le groupe WhatsApp */}
            <a
              href="https://chat.whatsapp.com/Kfp0U8toIYLLu81ROo0XNb" // Remplace par ton numéro
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-green-500 hover:border-green-600"
            >
              Groupe WhatsApp
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-orange-400/30">
            <div className="flex items-center space-x-2 text-orange-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">100% Gratuit</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Inscription rapide et facile</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-100">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
