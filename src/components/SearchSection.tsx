// components/SearchSection.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users } from "lucide-react";
import rawAirports from "@/lib/airport.json";
import AirportInput from "@/components/AirportInput";

interface Airport {
  iata: string;
  city: string;
  name: string;
  country?: string;
}

interface SearchSectionProps {
  onStart?: () => void;
  onFinish?: (results: unknown[], meta: unknown) => void;
}

// Cast imported JSON to typed Airport[] safely
const airports = rawAirports as unknown as Airport[];

export default function SearchSection({
  onStart,
  onFinish,
}: SearchSectionProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [passengers, setPassengers] = useState("1");
  const [error, setError] = useState<string | null>(null);
  // suggestions handled by AirportInput component

  function guessIata(input: string): string {
  if (!input) return "";

  // Try to extract IATA code (3 letters inside parentheses or anywhere)
  const match = input.match(/\b([A-Z]{3})\b/);
  if (match) return match[1].toUpperCase();

  const q = input.trim().toLowerCase();

  const byName = airports.find(
    (a) =>
      a.city?.toLowerCase().includes(q) ||
      a.name?.toLowerCase().includes(q) ||
      a.country?.toLowerCase().includes(q)
  );

  return byName ? byName.iata : "";
}




  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    onStart?.();

    const departure_id = guessIata(from);
    const arrival_id = guessIata(to);

    console.log("Extracted codes:", { departure_id, arrival_id });

    if (!departure_id || !arrival_id) {
      setError("Please enter valid airport codes or cities");
      onFinish?.([], null);
      return;
    }

    // Validate 3-letter codes
    if (departure_id.length !== 3 || arrival_id.length !== 3) {
      setError("Invalid airport codes. Please use 3-letter IATA codes.");
      onFinish?.([], null);
      return;
    }

    try {
      const qs = new URLSearchParams({
        from: departure_id,
        to: arrival_id,
        date,
        passengers,
      });

      console.log("Searching flights:", {
        from: departure_id,
        to: arrival_id,
        date,
        passengers,
      });

      const res = await fetch(`/api/flights?${qs.toString()}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Search failed" }));
        setError(err?.error || `HTTP Error: ${res.status}`);
        onFinish?.([], null);
        return;
      }

      const json = await res.json();
      console.log("Flight results:", json);

      if (json.error) {
        setError(json.error);
        onFinish?.([], null);
        return;
      }

      const results = json.results || [];
      onFinish?.(results, json.meta || null);

      if (results.length === 0) {
        setError(
          "No flights found for this route. Try different dates or airports."
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Network error. Please try again.";
      console.error("Search error:", err);
      setError(errorMessage);
      onFinish?.([], null);
    }
  }

  return (
    <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-foreground">
              Find Your Perfect Flight ✈️
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Search and compare flights from top airlines with BoofLight
            </p>
          </div>

          <form
            className="bg-card rounded-2xl shadow-2xl p-6 md:p-8"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* From Input with suggestions */}
              <div className="relative">
                <AirportInput
                  label="From"
                  onInputChange={(value) => setFrom(value)}
                  onSelect={(iata) => setFrom(iata)}
                />
              </div>

              {/* To Input with suggestions */}
              <div className="relative">
                <AirportInput
                  label="To"
                  onInputChange={(value) => setTo(value)}
                  onSelect={(iata) => setTo(iata)}
                />
              </div>

              {/* Date Input */}
              <div>
                <label className=" text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Departure Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="text-base"
                  required
                />
              </div>

              {/* Passengers Select */}
              <div>
                <label className=" text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="5">5 Passengers</option>
                  <option value="6">6 Passengers</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Flights
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
