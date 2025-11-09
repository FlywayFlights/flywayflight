// src/app/booking/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingClient from "@/components/BookingClient";
import { useBooking } from "@/context/BookingContext";

export default function BookingPage() {
  const { ticket } = useBooking();
  const router = useRouter();

  useEffect(() => {
    if (!ticket) router.push("/"); // safe-guard if someone opens /booking directly
  }, [ticket, router]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading booking details...
      </div>
    );
  }

  // Pass ticket as summary prop (your BookingClient expects summary)
  return <BookingClient summary={ticket} />;
}
