"use server"

import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined in environment variables");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  // check if user already has connect account
  const existingStripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId,
    }
  );

  if (existingStripeConnectId) {
    return { account: existingStripeConnectId };
  }

  // creer un compte connect stripe
  const account = await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      
      transfers: { requested: true }, 
    },
  });

  // mise a jour de l'utilisteur dans la base de donnees 
  await convex.mutation(api.users.updateOrCreateUsersStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  });

  return { account: account.id };
}