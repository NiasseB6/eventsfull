"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import { Id } from "@/convex/_generated/dataModel"
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStorageUrl } from "@/lib/utils";
import Spinner from "@/components/Spinner";
import { Calendar, CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import Image from "next/image";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import JoinQueue from "@/components/JoinQueue";

function EventPage() {
  const { user } = useUser();
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  const availability = useQuery(api.events.getEventAvailability, {
    eventId: params.id as Id<"events">,
  });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* detail de l'evenement */}
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-sm overflow-hidden">
          {/* image de l'evenement */}
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              priority
              />
            </div>
          )}

          {/* les details de l'evenement */}
          <div className="p-8">
            <div className="grid grid-cols-2 lg:grid-clos-2 gap-12">
              {/* colonne de gauche - detail de l'evenement */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {event.name}
                  </h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-[#184C99]"/>
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Localisation */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-5 h-5 text-[#184C99]"/>
                      <span className="text-sm font-medium"> Lieu</span>
                    </div>
                    <p className="text-gray-900">{event.location}</p>
                  </div>

                  {/* Le prix du ticket */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Ticket className="w-5 h-5 mr-2 text-[#184C99]"/>
                    <span className="text-sm font-medium">Prix</span>
                  </div>
                  <p className="text-gray-900">{event.price.toFixed(2)} FCFA</p>
                </div>

                {/* L'utilisateur du ticket */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Users className="w-5 h-5 mr-2 text-[#184C99]"/>
                    <span className="text-sm font-medium">Disponible</span>
                  </div>
                  <p className="text-gray-900">
                    {availability.totalTickets - availability.purchasedCount}
                    {" "}
                    / {availability.totalTickets} restant
                  </p>
                </div>
                </div>

                {/* informations complementaires */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Information sur l'évènement
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Venez 30 minutes avant que l'évènement commence</li>
                    <li>• Le ticket est non remboursable</li>
                  </ul>
                </div>
              </div>

              {/* la colonne de droite */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard eventId={params.id as Id<"events">}/>

                    {user ? (
                      <JoinQueue
                      eventId={params.id as Id<"events">}
                      userId={user.id as Id<"users">}/>
                    ) : (
                      <SignInButton>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 
                        hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg 
                        transition-all duration-200 shadow-md hover:shadow-lg">
                          Connecter vous pour achat de tickets
                        </Button>
                      </SignInButton>
                    )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPage
