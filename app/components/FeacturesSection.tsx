import React from 'react';
import { MapPin, Star, Shield, Zap, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Localisation',
    description: 'Trouvez facilement les vendeuses proches de chez vous grâce à notre géolocalisation précise.',
    color: 'orange'
  },
  {
    icon: Star,
    title: 'Notes & Avis',
    description: 'Découvrez celles qui vendent les meilleurs plats grâce aux avis authentiques de la communauté.',
    color: 'yellow'
  },
  {
    icon: Shield,
    title: 'Confiance',
    description: 'Seules les vendeuses bien notées et vérifiées apparaissent dans Savaeat.',
    color: 'green'
  },
  {
    icon: Zap,
    title: 'Rapidité',
    description: 'Commandez et récupérez vos plats en quelques minutes seulement.',
    color: 'blue'
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Rejoignez une communauté de plus de 10 000 utilisateurs satisfaits.',
    color: 'purple'
  },
  {
    icon: Clock,
    title: 'Disponibilité',
    description: 'Consultez les horaires en temps réel et la disponibilité des plats.',
    color: 'indigo'
  },
];

const colorClasses = {
  orange: 'bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white',
  yellow: 'bg-yellow-100 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white',
  green: 'bg-green-100 text-green-500 group-hover:bg-green-500 group-hover:text-white',
  blue: 'bg-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white',
  purple: 'bg-purple-100 text-purple-500 group-hover:bg-purple-500 group-hover:text-white',
  indigo: 'bg-indigo-100 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white',
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Savaeat ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme complète qui révolutionne la façon dont vous découvrez et commandez vos plats locaux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100 hover:border-gray-200"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="h-8 w-8 transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;