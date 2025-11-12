"use client";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { getAirportSuggestions } from "@/lib/getAirportSuggestions";
import type { Airport } from "@/lib/getAirportSuggestions";
import { MapPin, Plane, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AirportInputProps {
  label: string;
  onSelect: (iata: string) => void;
  onInputChange?: (value: string) => void;
  value?: string;
}

const AirportInput: React.FC<AirportInputProps> = ({
  label,
  onSelect,
  onInputChange,
  value = "",
}) => {
  const [query, setQuery] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onInputChange?.(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    getAirportSuggestions(value)
      .then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleSelect = (airport: Airport) => {
    const displayValue = `${airport.city} (${airport.iata})`;
    setQuery(displayValue);
    setSuggestions([]);
    setIsFocused(false);
    onSelect(airport.iata);
    onInputChange?.(displayValue);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.label
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-white/95 text-sm font-semibold mb-2.5 tracking-wide"
      >
        <motion.div
          animate={{
            scale: isFocused ? [1, 1.1, 1] : 1,
            rotate: isFocused ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <MapPin className="w-4 h-4 text-indigo-300" />
        </motion.div>
        {label}
      </motion.label>

      {/* Input Field */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative flex items-center bg-white/10 border transition-all duration-300 rounded-2xl px-4 py-3.5 backdrop-blur-md group ${
          isFocused
            ? "border-indigo-400/60 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/20 bg-white/15"
            : "border-white/20 hover:border-white/30 hover:bg-white/12"
        }`}
      >
        <Plane className="w-5 h-5 text-indigo-300/70 mr-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder="City, airport, or country..."
          className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none text-sm font-medium tracking-wide"
        />
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="ml-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
          </motion.div>
        )}
        {/* Glow effect on focus */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-indigo-500/10 pointer-events-none"
          />
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {suggestions.length > 0 && isFocused && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 border border-indigo-100/50 overflow-hidden"
            style={{ scrollbarWidth: "thin" }}
          >
            {suggestions.map((airport, index) => (
              <motion.li
                key={airport.iata}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(airport);
                }}
                className="p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 cursor-pointer border-b border-gray-100/50 last:border-b-0 group/item"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-1">
                      <span className="truncate">
                        {airport.city}, {airport.country}
                      </span>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="text-indigo-600 font-extrabold text-xs bg-indigo-50 px-2 py-0.5 rounded-md flex-shrink-0"
                      >
                        {airport.iata}
                      </motion.span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {airport.name}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 45 }}
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Plane className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  </motion.div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AirportInput;
