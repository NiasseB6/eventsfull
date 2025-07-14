"use server";

import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex"
import { DURATIONS } from "@/convex/constants";
import baseUrl from "@/lib/baseUrl";


export type StripeCheckoutMetadata = {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
};

export async function createStripeCheckoutSession({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("User is not authenticated");

  const convex = getConvexClient();

  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  if (!queuePosition || queuePosition.status !== "offered") {
    throw new Error("no valid ticket offer found");
  }

  const stripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId: event.userId,
    }
  );

  if (!stripeConnectId) {
    throw new Error("Stripe connect ID not found for owner of the event");
  }

  if (!queuePosition.offerExpiresAt) {
    throw new Error("Ticket offer has not expired date");
  }

  const metadata: StripeCheckoutMetadata = {
    eventId,
    userId,
    waitingListId: queuePosition._id,
  };

  // creer une session de paiment stripe
  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: event.name,
              description: event.description,
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(event.price * 100 * 0.01) // 1 pourcent de frais de service
      },
      expires_at: Math.floor(Date.now() / 1000) + DURATIONS.TICKET_OFFER / 1000, // 30 minutes pour que l'utilisateur puisse payer
      mode: "payment",
      success_url: `${baseUrl}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/event/${eventId}`,
    },
    {
      stripeAccount: stripeConnectId,
    }
  );

  return { sessionId: session.id, sessionUrl: session.url };
}