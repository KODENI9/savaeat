import React from 'react';
import { CookingPot } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 rounded-full p-2">
              <CookingPot className='h-6 w-6 text-white' />
            </div>
            <span className="text-xl font-bold">Savaeat</span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Contact
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              À propos
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Savaeat – Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;