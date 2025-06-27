"use client";

import { api } from "@/convex/_generated/api";
import { updateUser } from "@/convex/users";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react"

function SyncUserWithConvex() {
  const { user } = useUser();
  // mise a jour de l'utitlisateur dans convex 
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) return;

    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.emailAddresses[0]?.emailAddress ?? "",
        });
      } catch (error) {
        console.error("Echec lors de la synchronisation de l'utilisateur avec convex:", error);
      }
    };
    syncUser();
  }, [user, updateUser])
  return null;
}

export default SyncUserWithConvex;
