// // lib/helpers/processQueueHelper.ts
// import { GenericDatabaseWriter } from "convex/server";
// import { Id } from "@/convex/_generated/dataModel";
// import { WAITING_LIST_STATUS } from "@/convex/constants";
// import { DatabaseWriter } from "@/convex/_generated/server";

// export async function processQueueHelper(
//   db: DatabaseWriter,
//   eventId: Id<"events">
// ) {
//   const waitingUsers = await db
//     .query("waitingList")
//     .withIndex("by_event_status", (q) =>
//       q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.PENDING)
//     )
//     .order("asc")
//     .collect();

//   const activeTickets = await db
//     .query("tickets")
//     .withIndex("by_event", (q) => q.eq("eventId", eventId))
//     .collect();

//   // Ici tu peux adapter selon ta logique métier
//   const MAX_CAPACITY = 100;
//   const hasFreeSpot = activeTickets.length < MAX_CAPACITY;

//   if (hasFreeSpot && waitingUsers.length > 0) {
//     await db.patch(waitingUsers[0]._id, {
//       status: WAITING_LIST_STATUS.OFFERED,
//     });
//   }
// }
