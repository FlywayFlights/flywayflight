"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Clock } from "lucide-react";
import Image from "next/image";
import { Flight, BookingOption } from "@/types/flight";
import { useBooking } from "@/context/BookingContext";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [loading, setLoading] = useState(false);
  const [bookingOptions, setBookingOptions] = useState<BookingOption[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const { setTicket } = useBooking();

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
      if (json.error) {
        alert(`Error: ${json.error}`);
        setLoading(false);
        return;
      }
      if (json.booking_options?.length) {
        setBookingOptions(json.booking_options);
        setShowOptions(true);
      } else {
        alert("No booking options available for this flight.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Failed to fetch booking options: ${errorMessage}`);
    }
  }

  const seg = flight.segments?.[0] || {};
  const lastSeg = flight.segments?.[flight.segments?.length - 1] || seg;

  function handleBook() {
    const summary = {
      airline: flight.airline || "",
      from: seg.departure_airport || "",
      to: lastSeg.arrival_airport || "",
      date: seg.departure_time?.slice(0, 10) || "",
      time: seg.departure_time?.slice(11, 16) || "",
      duration: flight.duration || "",
      price: flight.price || "",
      flight_number: seg.flight_number || "",
    };

    setTicket(summary);
    router.push("/booking");
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={
                flight.airline_logo ||
                "https://upload.wikimedia.org/wikipedia/commons/a/a0/Airplane_silhouette.svg"
              }
              alt={flight.airline || "Airline"}
              width={40}
              height={40}
              className="rounded-md"
            />
            <div>
              <p className="font-semibold text-lg">{flight.airline}</p>
              <p className="text-sm text-muted-foreground">
                Flight {seg.flight_number || "—"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-primary">
              ₹{flight.price}
            </p>
            <p className="text-xs text-muted-foreground">per traveller</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-foreground">
              {seg.departure_airport}
            </p>
            <p>{seg.departure_time?.slice(11, 16)}</p>
          </div>
          <div className="flex flex-col items-center">
            <Plane className="w-5 h-5 mb-1 text-primary" />
            <span>{flight.duration || "—"}</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-foreground">
              {lastSeg.arrival_airport}
            </p>
            <p>{lastSeg.arrival_time?.slice(11, 16)}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        {!showOptions ? (
          <>
            <Button className="flex-1" onClick={handleBook}>
              Book
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={viewBookingOptions}
              disabled={loading || !flight.booking_token}
            >
              {loading ? "Loading..." : "View Options"}
            </Button>
          </>
        ) : (
          <div className="w-full space-y-2">
            {bookingOptions.map((option, i) => (
              <div
                key={i}
                className="border rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{option.provider}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.fare_type}
                  </p>
                </div>
                <p className="font-semibold text-primary">₹{option.price}</p>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowOptions(false)}
            >
              Hide Options
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
