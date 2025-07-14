"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQueries, useQuery } from "convex/react";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReleaseTicket from "./ReleaseTicket";

function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  // Initialise le routeur Next.js pour naviguer entre les pages
  const router = useRouter();

  // Récupère l'utilisateur courant via un hook personnalisé
  const { user } = useUser();

  // Utilise un hook personnalisé pour obtenir la position dans la file d'attente de l'utilisateur pour un événement donné
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  // État local pour afficher le temps restant pour acheter le ticket
  const [timeRemaining, setTimeRemaining] = useState("");

  // État local pour indiquer si une opération est en cours (ex : chargement)
  const [isLoading, setIsLoading] = useState(false);

  // Récupère la date d'expiration de l'offre depuis la position dans la file d'attente
  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;

  // Détermine si l'offre a expiré
  const isExpired = Date.now() > offerExpiresAt;

  // Met à jour le temps restant à chaque changement de l'expiration de l'offre ou de son état
  useEffect(() => {
    // Calcule et met à jour le temps restant avant l'expiration de l'offre
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expirer");
        return;
      }
      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
            seconds === 1 ? "" : "s"
          }`
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };
     calculateTimeRemaining();

     const interval = setInterval(calculateTimeRemaining, 1000);
      return () => clearInterval(interval);
    // ... il manque ici l'appel à calculateTimeRemaining et éventuellement un intervalle pour mettre à jour le temps en temps réel
  }, [offerExpiresAt, isExpired]);

  const handlePurchase = async () => {};

  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null; 
  }

  return (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 reounded-full bg-amber-100 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-amber-600"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ticket Réservé
              </h3>
              <p className="text-sm text-gray-500">
                Expire dans {timeRemaining}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 leading-relaxed">
            Vous avez réserver le ticket. Complèter votre achat avant l'expiration pour assurer votre place. 
          </div>
        </div>
      </div>
      <button 
      onClick={handlePurchase}
      disabled={isExpired || isLoading}
      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold
      shadow-md hover:from-amber-600 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-200
       disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
      >
        {isLoading
        ? "Achat en cours..."
        : "Reserve ton ticket maintenant 👉 "
        }
      </button>

        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id}/>
        </div>
    </div>
  </div> 
  ); 
} 

export default PurchaseTicket;
