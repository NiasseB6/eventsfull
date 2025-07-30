"use client";
import React from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-[800px] bg-gradient-to-r from-[#184C99] to-[#041a3b] text-white overflow-hidden mb-20">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] rounded-full bg-white/30 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -right-[10%] h-[80%] w-[80%] rounded-full bg-white/30 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            Découvrez des événements incroyables près de chez vous.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 md:mb-10">
            <span className="text-[#F37021] font-bold">Events-Full</span> est la
            plateforme idéale pour découvrir, réserver et gérer tous vos
            événements préférés. Concerts, conférences, expositions, festivals
            ou spectacles : trouvez des billets en quelques clics et accédez facilement avec un QR code
            sécurisé. Que vous soyez spectateur ou organisateur, vivez une
            expérience fluide, moderne et 100% digitale.
          </p>

          <div className=" w-full flex justify-center gap-3">
            <Link href="/seller" className="flex-1">
              <button className=" w-full bg-[#184C99] text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition">
                Vendeur
              </button>
            </Link>
            <Link href="/tickets" className="flex-1">
              <button
                className=" w-full bg-[#F37021] text-gray-800 px-3 py-1.5 text-sm
              rounded-lg hover:bg-gray-200 transition border border-gray-300"
              >
                Mes Billets
              </button>
            </Link>
          </div>
          {/* <div className="flex flex-wrap gap-3">
            <Link
              href="/EventList"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              Concerts
            </Link>
            <Link
              href="/events?category=conference"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              Conferences
            </Link>
            <Link
              href="/events?category=exhibition"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              Exhibitions
            </Link>
            <Link
              href="/events?category=sports"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              Sports
            </Link>
            <Link
              href="/events?category=theater"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              Theater
            </Link>
          </div> */}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          fill="white"
        >
          <path d="M0,96L80,101.3C160,107,320,117,480,117.3C640,117,800,107,960,85.3C1120,64,1280,32,1360,16L1440,0L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};
export default HeroSection;
