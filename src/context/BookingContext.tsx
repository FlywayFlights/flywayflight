// src/context/BookingContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Ticket = {
  // flight summary fields
  airline?: string;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  duration?: string;
  price?: string;
  flight_number?: string;
  stops?: number;

  // passenger fields (added later)
  name?: string;
  gender?: string;
  age?: string;
  phone?: string;
  email?: string;

  // additional flight details
  arrivalDate?: string;
  arrivalTime?: string;
  class?: string;
  seat?: string;

  // generated IDs
  pnr?: string;
  bookingNo?: string;
  ticketNumber?: string;
};

type BookingContextType = {
  ticket: Ticket | null;
  setTicket: (t: Ticket | null) => void;
  clearTicket: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [ticket, setTicketState] = useState<Ticket | null>(null);

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("booflight_ticket");
      if (raw) {
        setTicketState(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      if (ticket)
        localStorage.setItem("booflight_ticket", JSON.stringify(ticket));
      else localStorage.removeItem("booflight_ticket");
    } catch (e) {
      // ignore
    }
  }, [ticket]);

  const setTicket = (t: Ticket | null) => setTicketState(t);
  const clearTicket = () => setTicketState(null);

  return (
    <BookingContext.Provider value={{ ticket, setTicket, clearTicket }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
