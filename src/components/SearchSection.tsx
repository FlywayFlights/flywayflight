// components/SearchSection.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import airports from "@/lib/airport.json";

interface Airport {
  code: string;
  city: string;
  name: string;
}

interface SearchSectionProps {
  onStart?: () => void;
  onFinish?: (results: unknown[], meta: unknown) => void;
}

export default function SearchSection({ onStart, onFinish }: SearchSectionProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [passengers, setPassengers] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  function guessIata(input: string): string {
    if (!input) return "";
    
    // Extract just the airport code if format is "CODE - City"
    const codeMatch = input.match(/^([A-Z]{3})\s*-/);
    if (codeMatch) {
      return codeMatch[1];
    }
    
    const q = input.trim().toUpperCase();
    
    // If user typed code already (3 letters)
    if (q.length === 3) {
      const asCode = (airports as Airport[]).find((a) => a.code.toUpperCase() === q);
      if (asCode) return asCode.code;
    }
    
    // Search by city or name (loose match)
    const byName = (airports as Airport[]).find(
      (a) =>
        a.city.toUpperCase().includes(q) ||
        a.name.toUpperCase().includes(q) ||
        a.code.toUpperCase() === q
    );
    
    return byName ? byName.code : input;
  }

  function handleFromInput(value: string) {
    setFrom(value);
    if (value.length >= 2) {
      const filtered = (airports as Airport[]).filter((a) => 
        a.city.toLowerCase().includes(value.toLowerCase()) ||
        a.code.toLowerCase().includes(value.toLowerCase()) ||
        a.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFromSuggestions(filtered);
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  }

  function handleToInput(value: string) {
    setTo(value);
    if (value.length >= 2) {
      const filtered = (airports as Airport[]).filter((a) => 
        a.city.toLowerCase().includes(value.toLowerCase()) ||
        a.code.toLowerCase().includes(value.toLowerCase()) ||
        a.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setToSuggestions(filtered);
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  }

  function selectFrom(airport: Airport) {
    setFrom(`${airport.code} - ${airport.city}`);
    setShowFromSuggestions(false);
  }

  function selectTo(airport: Airport) {
    setTo(`${airport.code} - ${airport.city}`);
    setShowToSuggestions(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    onStart?.();

    const departure_id = guessIata(from);
    const arrival_id = guessIata(to);

    console.log('Extracted codes:', { departure_id, arrival_id });

    if (!departure_id || !arrival_id) {
      setError("Please enter valid airport codes or cities");
      onFinish?.([], null);
      return;
    }

    // Validate that codes are 3 letters
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

      console.log('Searching flights:', { from: departure_id, to: arrival_id, date, passengers });

      const res = await fetch(`/api/flights?${qs.toString()}`);
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Search failed" }));
        setError(err?.error || `HTTP Error: ${res.status}`);
        onFinish?.([], null);
        return;
      }

      const json = await res.json();
      console.log('Flight results:', json);

      if (json.error) {
        setError(json.error);
        onFinish?.([], null);
        return;
      }

      const results = json.results || [];
      onFinish?.(results, json.meta || null);

      if (results.length === 0) {
        setError("No flights found for this route. Try different dates or airports.");
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error. Please try again.";
      console.error('Search error:', err);
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
              {/* From Input */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  From
                </label>
                <Input 
                  id="from" 
                  value={from} 
                  onChange={(e) => handleFromInput(e.target.value)}
                  onFocus={() => from.length >= 2 && setShowFromSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                  placeholder="City or airport code (e.g., DEL, Mumbai)" 
                  className="text-base"
                  required
                />
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {fromSuggestions.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => selectFrom(airport)}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
                      >
                        <div className="font-semibold">{airport.code} - {airport.city}</div>
                        <div className="text-sm text-muted-foreground">{airport.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* To Input */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  To
                </label>
                <Input 
                  id="to" 
                  value={to} 
                  onChange={(e) => handleToInput(e.target.value)}
                  onFocus={() => to.length >= 2 && setShowToSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                  placeholder="City or airport code (e.g., BOM, Delhi)" 
                  className="text-base"
                  required
                />
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {toSuggestions.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => selectTo(airport)}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
                      >
                        <div className="font-semibold">{airport.code} - {airport.city}</div>
                        <div className="text-sm text-muted-foreground">{airport.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Departure Date
                </label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-base"
                  required
                />
              </div>

              {/* Passengers Select */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
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

            <Button type="submit" size="lg" className="w-full text-base font-semibold">
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