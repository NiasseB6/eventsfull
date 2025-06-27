"use client"

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Spinner from "./Spinner";

function EventList() {
    const events = useQuery(api.events.get);

    if (!events) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <Spinner/>
        </div>
      );
    }

  return (
    <div>
      <h1>Events List</h1>
    </div>
  )
}

export default EventList
