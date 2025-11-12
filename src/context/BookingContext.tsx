// src/context/BookingContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Each passenger's details
export type Passenger = {
  name?: string;
  gender?: string;
  age?: string;
  phone?: string;
  email?: string;
  seat?: string;
  class?: string;
};

// Full ticket/booking data
export type Ticket = {
  name?: string;
  gender?: string;
  age?: string;
  phone?: string;
  email?: string;
  seat?: string;
  class?: string;
  // Flight details
  airline?: string;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  duration?: string;
  price?: string; // Final total price after discount (for all passengers)
  price_per_passenger?: string; // Price per passenger after discount
  original_price?: string; // Total original price before discount
  original_price_per_passenger?: string; // Original price per passenger
  discounted_price?: string; // Display discount if needed
  passengerCount?: number; // Number of passengers (alias for totalPassengers)
  flight_number?: string;
  stops?: number;

  // Additional flight metadata
  arrivalDate?: string;
  arrivalTime?: string;

  // Booking IDs
  pnr?: string;
  bookingNo?: string;
  ticketNumber?: string;

  // Passenger section
  passengers?: Passenger[];
  totalPassengers?: number;
};

type BookingContextType = {
  ticket: Ticket | null;
  setTicket: (t: Ticket | null) => void;
  clearTicket: () => void;
  updatePassengers: (count: number) => void;
  updatePassengerDetails: (index: number, data: Partial<Passenger>) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [ticket, setTicketState] = useState<Ticket | null>(null);

  // Load saved ticket from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("booflight_ticket");
      if (saved) {
        setTicketState(JSON.parse(saved));
      }
    } catch {
      console.warn("Failed to parse saved ticket");
    }
  }, []);

  // Save ticket to localStorage on change
  useEffect(() => {
    try {
      if (ticket)
        localStorage.setItem("booflight_ticket", JSON.stringify(ticket));
      else localStorage.removeItem("booflight_ticket");
    } catch {
      console.warn("Failed to save ticket");
    }
  }, [ticket]);

  // Set ticket object
  const setTicket = (t: Ticket | null) => setTicketState(t);

  // Clear all booking data
  const clearTicket = () => {
    setTicketState(null);
    localStorage.removeItem("booflight_ticket");
  };

  // Update total passengers dynamically
  const updatePassengers = (count: number) => {
    if (!ticket) return;

    const current = ticket.passengers || [];
    let updated = [...current];

    // Add empty slots if new count is higher
    if (count > current.length) {
      for (let i = current.length; i < count; i++) {
        updated.push({});
      }
    } else if (count < current.length) {
      // Trim extra passengers
      updated = updated.slice(0, count);
    }

    setTicketState({
      ...ticket,
      passengers: updated,
      totalPassengers: count,
    });
  };

  // Update individual passenger info
  const updatePassengerDetails = (index: number, data: Partial<Passenger>) => {
    if (!ticket || !ticket.passengers) return;

    const updatedPassengers = [...ticket.passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      ...data,
    };

    setTicketState({
      ...ticket,
      passengers: updatedPassengers,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        ticket,
        setTicket,
        clearTicket,
        updatePassengers,
        updatePassengerDetails,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook for easy access
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
