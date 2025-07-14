"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { toast, useSonner } from "sonner";
import Spinner from "./Spinner";
import { WAITING_LIST_STATUS } from "@/convex/constants";
import { Clock, OctagonXIcon } from "lucide-react";

function JoinQueue({
  eventId,
  userId,
}: {
  eventId: Id<"events">;
  userId: Id<"users">;
}) {
  const sonner = useSonner();
  const joinWaitingList = useMutation(api.events.joinWaintingList);
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId,
  });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const event = useQuery(api.events.getById, { eventId });

  const isEventOwner = userId === event?.userId;

  const handleJoinQueue = async () => {
    try {
      const result = await joinWaitingList({ eventId, userId });
      if (result.success) {
        console.log("Successfully joined waiting list");
        toast(result.message, {
          duration: 5000,
        });
      }
    } catch (error) {
      if (
        error instanceof ConvexError &&
        error.message.includes("joined the waiting list too many times")
      ) {
        toast.error("Slow down there!", {
          description: error.data,
          duration: 5000,
        });
      } else {
        console.error("Error joining waiting list:", error);
        toast.error("Uh oh! Someting went wrong", {
          description: (error as any)?.data,
          duration: 5000,
        });
      }
    }
  };
  if (queuePosition === undefined || availability === undefined || !event) {
    return <Spinner />;
  }

  if (userTicket) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  return (
    <div>

    {( !queuePosition ||
    queuePosition.status === WAITING_LIST_STATUS.EXPIRED ||
    (queuePosition.status === WAITING_LIST_STATUS.OFFERED && 
      queuePosition.offerExpiresAt && 
      queuePosition.offerExpiresAt <= Date.now())) && (
        <>
         { isEventOwner ? (
          <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg">
            <OctagonXIcon className="w-5 h-5"/>
            <span>Vous ne pouvez pas acheter un billet pour votre propre événement</span>
          </div>
         ) : (
          isPastEvent ? (
            <div className="flex items-center justify-center  gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
              <Clock className="w-5 h-5"/>
              <span>evenement passé</span>
            </div>
          ) : availability.purchasedCount >= availability?.totalTickets ? (
            <div className="text-center p-4">
              <p className="text-lg font-semibold text-red-600">
                Sorry, this event is sold out !
              </p>
            </div>
          ) : (
            <button
             onClick={handleJoinQueue}
             disabled={isPastEvent || isEventOwner}
             className="w-full bg-[#184C99] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors 
             duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
               Acheter 
             </button>
          )
        )}
        </>
      )}
    </div>
  );
}

export default JoinQueue;
