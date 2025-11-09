"use client";
import { useBooking, Ticket } from "@/context/BookingContext";
import TicketClient from "@/components/TicketClient";
import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";

export default function TicketPage() {
  const { ticket } = useBooking();
  const router = useRouter();

  // Cast the imported component to a ComponentType that accepts a `ticket` prop
  const TypedTicketClient = TicketClient as ComponentType<{ ticket: Ticket }>;

  useEffect(() => {
    if (!ticket) router.push("/"); // Redirect if no data
  }, [ticket, router]);

  if (!ticket) return <p>Loading ticket...</p>;

  return <TypedTicketClient ticket={ticket} />;
}
