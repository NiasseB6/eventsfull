// // lib/checkAvailabilityHelper.ts
// import type { GenericDatabaseReader } from "convex/server";
// import type { Id } from "../convex/_generated/dataModel";
// import { DatabaseReader } from "@/convex/_generated/server";

// export async function checkAvailabilityHelper(
//   db: DatabaseReader,
//   eventId: Id<"events">
// ): Promise<boolean> {
//   const tickets = await db
//     .query("tickets")
//     .withIndex("by_event", (q) => q.eq("eventId", eventId))
//     .collect();

//   return tickets.some((t) => t.status === "valid");
// }