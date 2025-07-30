import React from "react";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#184C99] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-[#F37021]">Events-full</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Trouvez, réservez et vivez les meilleurs événements autour de
              vous. Recevez vos billets instantanément avec un QR code sécurisé
              grâce à Events-Full, votre plateforme de billetterie moderne.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-300 hover:text-[#F37021] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-[#F37021] transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-[#F37021] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-[#F37021] transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#F37021] transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#F37021] transition-colors"
                >
                  Évènements
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#F37021] transition-colors"
                >
                  A propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-400 mr-3 mt-0.5" />
                <span className="text-gray-300">
                  Malika Cité sonatel, Dakar
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-400 mr-3" />
                <span className="text-gray-300">+221 77 265 35 58</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-400 mr-3" />
                <span className="text-gray-300">info@events-full.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; {currentYear} <span className="text-[#F37021]">Events-Full.</span> Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-[#F37021] text-sm"
            >
              Conditions d'utilisation
            </Link>
            <Link
              href="/"
              className="text-gray-300 hover:text-[#F37021] text-sm"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
