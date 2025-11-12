"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plane, ChevronUp, Users } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import type { Flight, BookingOption } from "@/types/flight";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [loading, setLoading] = useState(false);
  const [bookingOptions, setBookingOptions] = useState<BookingOption[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const { ticket, setTicket } = useBooking();

  // Get passenger count from booking context
  const passengerCount = ticket?.totalPassengers || ticket?.passengerCount || Number(ticket?.passengers?.length) || 1;

  // Calculate per-passenger prices
  const originalPricePerPassenger =
    Number((flight.price ?? "0").replace(/[^\d]/g, "")) || 0;
  const discountedPricePerPassenger = Math.round(originalPricePerPassenger * 0.88);
  
  // Calculate total prices for all passengers
  const originalPriceTotal = originalPricePerPassenger * passengerCount;
  const discountedPriceTotal = discountedPricePerPassenger * passengerCount;
  
  const formattedOriginalPerPassenger = `₹${originalPricePerPassenger.toLocaleString()}`;
  const formattedDiscountPerPassenger = `₹${discountedPricePerPassenger.toLocaleString()}`;
  const formattedOriginalTotal = `₹${originalPriceTotal.toLocaleString()}`;
  const formattedDiscountTotal = `₹${discountedPriceTotal.toLocaleString()}`;

  async function viewBookingOptions() {
    if (!flight.booking_token) {
      alert("No booking token available for this flight.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/flights/booking?token=${encodeURIComponent(flight.booking_token)}`
      );
      const json = await res.json();

      if (json.error) throw new Error(json.error);
      if (json.booking_options?.length) {
        setBookingOptions(json.booking_options);
        setShowOptions(true);
      } else {
        alert("No booking options found.");
      }
    } catch (err) {
      alert((err as Error).message || "Failed to fetch booking options.");
    } finally {
      setLoading(false);
    }
  }

  function handleBook() {
    const seg = flight.segments?.[0];
    const lastSeg = flight.segments?.[flight.segments?.length - 1] || seg;

    // Store per-passenger price and total price
    setTicket({
      ...ticket,
      airline: flight.airline || "",
      from: seg?.departure_airport || "",
      to: lastSeg?.arrival_airport || "",
      date: seg?.departure_time?.slice(0, 10) || "",
      time: seg?.departure_time?.slice(11, 16) || "",
      duration: flight.duration || "",
      price: formattedDiscountTotal, // Total price for all passengers
      price_per_passenger: formattedDiscountPerPassenger, // Per passenger price
      original_price: formattedOriginalTotal, // Total original price
      original_price_per_passenger: formattedOriginalPerPassenger, // Per passenger original
      flight_number: seg?.flight_number || "",
      stops: flight.stops || 0,
      arrivalDate: lastSeg?.arrival_time?.slice(0, 10) || "",
      arrivalTime: lastSeg?.arrival_time?.slice(11, 16) || "",
    });

    router.push("/booking");
  }

  const seg = flight.segments?.[0];
  const lastSeg = flight.segments?.[flight.segments?.length - 1] || seg;

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 w-full max-w-3xl mx-auto mb-6">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={
              flight.airline_logo ||
              "https://upload.wikimedia.org/wikipedia/commons/a/a0/Airplane_silhouette.svg"
            }
            alt={flight.airline || "Airline"}
            width={48}
            height={48}
            className="rounded-lg border border-gray-100"
          />
          <div>
            <p className="font-semibold text-lg text-gray-900">
              {flight.airline || "Unknown Airline"}
            </p>
            <p className="text-sm text-gray-500">
              Flight {seg?.flight_number || "—"}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">{passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Original (per person)</span>
            <p className="text-sm text-gray-500 line-through">
              {formattedOriginalPerPassenger}
            </p>
          </div>
          <div className="mt-1">
            <p className="text-xs text-gray-500 mb-0.5">Per Person</p>
            <p className="text-xl font-bold text-blue-600">
              {formattedDiscountPerPassenger}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">Total Price</p>
            <p className="text-2xl font-bold text-indigo-600">
              {formattedDiscountTotal}
            </p>
          </div>
          <p className="text-xs text-green-600 font-medium mt-1">12% OFF</p>
        </div>
      </div>

      {/* FLIGHT DETAILS */}
      <div className="flex justify-between items-center mt-6 text-gray-800">
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{seg?.departure_airport}</p>
          <p className="text-sm text-gray-500">
            {seg?.departure_time?.slice(11, 16)}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Plane className="w-6 h-6 text-blue-600 mb-1" />
          <p className="text-xs font-medium text-gray-500">
            {flight.duration || "—"}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{lastSeg?.arrival_airport}</p>
          <p className="text-sm text-gray-500">
            {lastSeg?.arrival_time?.slice(11, 16)}
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleBook}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all"
        >
          Book Now
        </button>

        <button
          onClick={viewBookingOptions}
          disabled={loading}
          className="flex-1 border border-blue-600 text-blue-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-all disabled:opacity-60"
        >
          {loading ? "Loading..." : "View Options"}
        </button>
      </div>

      {/* BOOKING OPTIONS */}
      {showOptions && (
        <div className="mt-5 border-t border-gray-200 pt-3 space-y-3">
          {bookingOptions.map((option, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{option.provider}</p>
                <p className="text-sm text-gray-500">{option.fare_type}</p>
              </div>
              <p className="font-semibold text-blue-600">₹{option.price}</p>
            </div>
          ))}

          <button
            onClick={() => setShowOptions(false)}
            className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 mt-2 hover:text-blue-600 transition"
          >
            Hide Options
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
