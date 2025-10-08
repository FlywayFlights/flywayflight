// components/FlightCard.tsx
"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plane, Clock, Calendar } from "lucide-react";

export default function FlightCard({ flight }: any) {
  const [loading, setLoading] = useState(false);
  const [bookingOptions, setBookingOptions] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  async function viewBookingOptions() {
    if (!flight.booking_token) {
      alert("No booking token available for this flight.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/flights/booking?token=${encodeURIComponent(flight.booking_token)}`);
      const json = await res.json();
      
      if (json.error) {
        alert(`Error: ${json.error}`);
        setLoading(false);
        return;
      }

      if (json.booking_options && json.booking_options.length > 0) {
        setBookingOptions(json.booking_options);
        setShowOptions(true);
        console.log("Booking options:", json.booking_options);
      } else {
        alert("No booking options available for this flight.");
      }
      
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      alert(`Failed to fetch booking options: ${err.message}`);
    }
  }

  const seg = flight.segments?.[0] || {};
  const lastSeg = flight.segments?.[flight.segments?.length - 1] || seg;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Airline Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {flight.airline_logo ? (
              <img 
                src={flight.airline_logo} 
                width={40} 
                height={40} 
                alt={flight.airline || "airline"} 
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <div className="font-semibold text-lg">{flight.airline || "Unknown Airline"}</div>
              {seg.flight_number && (
                <div className="text-xs text-muted-foreground">{seg.flight_number}</div>
              )}
            </div>
          </div>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{seg.departure_time || "—"}</div>
            <div className="text-sm font-medium text-muted-foreground">{seg.departure_airport || "—"}</div>
          </div>

          <div className="flex-1 mx-4">
            <div className="relative">
              <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
              <Plane className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary rotate-90" />
            </div>
            <div className="text-xs text-center text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              {flight.duration || "—"}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold">{lastSeg.arrival_time || "—"}</div>
            <div className="text-sm font-medium text-muted-foreground">{lastSeg.arrival_airport || "—"}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between pt-4 border-t">
          {seg.travel_class && (
            <div className="text-sm text-muted-foreground">
              Class: <span className="font-medium text-foreground">{seg.travel_class}</span>
            </div>
          )}
          <div className="text-3xl font-bold text-primary">{flight.price || "—"}</div>
        </div>

        {/* Carbon Emissions */}
        {flight.carbon_emissions && (
          <div className="mt-3 text-xs text-muted-foreground">
            🌱 {flight.carbon_emissions.this_flight}g CO₂ emissions
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {!showOptions ? (
          <Button 
            className="w-full" 
            onClick={viewBookingOptions} 
            disabled={loading || !flight.booking_token}
          >
            {loading ? "Loading..." : "View Booking Options"}
          </Button>
        ) : (
          <div className="w-full space-y-2">
            <div className="font-semibold mb-2">Available Booking Options:</div>
            {bookingOptions.slice(0, 3).map((option: any, idx: number) => (
              
                <a
                key={idx}
                href={option.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.source || `Option ${idx + 1}`}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.price || flight.price}
                  </span>
                </div>
              </a>
            
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