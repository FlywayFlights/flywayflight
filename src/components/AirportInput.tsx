import React, { useState, ChangeEvent } from "react";
import { getAirportSuggestions } from "@/lib/getAirportSuggestions";
import type { Airport } from "@/lib/getAirportSuggestions";

// Use Airport type from lib to keep shapes consistent

interface AirportInputProps {
  label: string;
  onSelect: (iata: string) => void;
  onInputChange?: (value: string) => void;
}

const AirportInput: React.FC<AirportInputProps> = ({ label, onSelect, onInputChange }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Airport[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onInputChange) onInputChange(value);
    // Fetch suggestions from public dataset (async)
    getAirportSuggestions(value).then((results) => {
      setSuggestions(results);
    });
  };

  const handleSelect = (airport: Airport) => {
    setQuery(`${airport.city} (${airport.iata})`);
    setSuggestions([]);
    onSelect(airport.iata);
  };

  return (
    <div className="relative w-full">
      <label className="block font-medium mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter city, airport, or country..."
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white shadow-md w-full mt-1 rounded-lg max-h-60 overflow-y-auto">
          {suggestions.map((airport) => (
            <li
              key={airport.iata}
              onClick={() => handleSelect(airport)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div className="font-semibold">
                {airport.city}, {airport.country}
              </div>
              <div className="text-gray-500">
                {airport.name} —{" "}
                <span className="font-medium">{airport.iata}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportInput;
