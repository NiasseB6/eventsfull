"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  CircleArrowRight,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  Ticket,
  XCircle,
} from "lucide-react";
import PurchaseTicket from "./PurchaseTicket";

function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId }); // fonction pour avoir les tickets a partir de la base de donnees
  const availability = useQuery(api.events.getEventAvailability, { eventId });

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  // attente d'achat du ticket
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event?.userId;

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status !== "waiting") return null;

    if (availability.purchasedCount >= availability.totalTickets) {
      return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Ticket className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Event is sold Out</span>
          </div>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      return (
        <div
          className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border 
        border-amber-100"
        >
          <div className="flex items-center">
            <CircleArrowRight className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-amber-700 font-medium">
              You&apos:re next in line! (Queue position:{" "}
              {queuePosition.position})
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="w-4 h-4 mr-1 animate-spin text-amber-500" />
            <span className="text-amber-600 text-sm">En attente de ticket</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center">
          <LoaderCircle className="w-4 h-4 mr-2 animate-spin text-blue-500" />
          <span className="text-blue-700">Position d'attente</span>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          #{queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) return null;

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/seller/events/${eventId}/edit`);
            }}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg 
          font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <PencilIcon className="w-5 h-5" />
            Modifier l'evenement
          </button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-gray-100">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">
              Vous avez votre ticket!
            </span>
          </div>
          <button
            onClick={() => router.push(`/tickets/${userTicket._id}`)}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-1.5 rounded-full 
          font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
          >
            Voir votre ticket
          </button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-4">
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}

          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-red-700 font-medium flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Offrer expirer
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all
    duration-300 border border-gray-100 cursor-pointer overflow-hidden relative ${
      isPastEvent ? "opacity-75 hover:opacity-100" : ""
    }`}
    >
      {/* image de l'evenement */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 
          to-transparent"
          />
        </div>
      )}

      {/* details des evenemets */}

      <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
        <div className="flex justify-between items-start">
          {/* nom de l'evenement et badge proprietaire */}
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span
                  className="inline-flex items-center gap-1 bg-[#184C99] text-white px-2
                  py-1 rounded-full text-xs font-medium"
                >
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            </div>
            {isPastEvent && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                bg-gray-100 text-gray-800 mt-2"
              >
                Evenement Passé
              </span>
            )}
          </div>
          {/* Prix des tickets */}
          <div className="flex flex-col items-end gap-2 ml-4 ">
            <span
              className={`px-4 py-1.5 font-semibold rounded-full ${
                isPastEvent
                  ? "bg-gray-50 text-gray-500"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {event.price.toFixed(2)} FCFA
            </span>
            {availability.purchasedCount >= availability.totalTickets && (
              <span
                className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold 
            rounded-full text-sm"
              >
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* details du tickets */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>
              {new Date(event.eventDate).toLocaleDateString()}{" "}
              {isPastEvent && "(Ended)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2" />
            <span>
              {availability
                ? `${availability.totalTickets - availability.purchasedCount} / ${availability.totalTickets} disponible`
                : "Loading availability..."}
              {!isPastEvent &&
                availability &&
                availability.activeOffers > 0 && (
                  <span className="text-amber-600 text-sm ml-2">
                    ({availability.activeOffers}{" "}
                    {availability.activeOffers === 1
                      ? "Une personne"
                      : "people"}{" "}
                    essaie d'acheter)
                  </span>
                )}
            </span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>

        <div onClick={(e) => e.stopPropagation()}>
          {!isPastEvent && renderTicketStatus()}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
