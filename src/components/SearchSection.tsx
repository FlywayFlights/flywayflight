"use client";
import { useState } from "react";
import {
  Search,
  Calendar,
  Users,
  ArrowRightLeft,
  Sparkles,
  Shield,
  Clock,
  TrendingDown,
  Gift,
  CheckCircle2,
  Plane,
} from "lucide-react";
import rawAirports from "@/lib/airport.json";
import AirportInput from "@/components/AirportInput";
import { useBooking, type Passenger } from "@/context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";

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

const airports = rawAirports as unknown as Airport[];

type TripType = "one-way" | "round-trip";
type FlightClass = "economy" | "business" | "first";

export default function SearchSection({
  onStart,
  onFinish,
}: SearchSectionProps) {
  const { ticket, setTicket } = useBooking();

  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [from, setFrom] = useState(ticket?.from || "");
  const [to, setTo] = useState(ticket?.to || "");
  const [date, setDate] = useState(
    ticket?.date ||
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().slice(0, 10);
      })()
  );
  const [returnDate, setReturnDate] = useState(
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toISOString().slice(0, 10);
    })()
  );
  const [passengers, setPassengers] = useState<string>(
    typeof ticket?.passengers === "string" ? ticket.passengers : "1"
  );
  const [flightClass, setFlightClass] = useState<FlightClass>("economy");
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function guessIata(input: string): string {
    if (!input) return "";
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
    setIsSubmitting(true);
    onStart?.();

    const departure_id = guessIata(from);
    const arrival_id = guessIata(to);

    if (!departure_id || !arrival_id) {
      setError("Please enter valid airport codes or cities.");
      onFinish?.([], null);
      setIsSubmitting(false);
      return;
    }

    try {
      const qs = new URLSearchParams({
        from: departure_id,
        to: arrival_id,
        date,
        passengers,
      });

      const res = await fetch(`/api/flights?${qs.toString()}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Unable to fetch flights. Try again.");
        onFinish?.([], null);
        setIsSubmitting(false);
        return;
      }

      const passengerArray: Passenger[] = Array.from(
        { length: Math.max(1, Number(passengers)) },
        () => ({} as Passenger)
      );

      const passengerCount = Number(passengers) || 1;
      setTicket({
        ...ticket,
        from,
        to,
        date,
        passengers: passengerArray,
        totalPassengers: passengerCount,
        passengerCount: passengerCount, // Store count for easy access
      });

      onFinish?.(json.results || [], json.meta || null);

      if ((json.results || []).length === 0) {
        setError("No flights found. Try another route or date.");
      }
    } catch {
      setError("Network error. Please try again later.");
      onFinish?.([], null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const swapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#1a1f3a] to-[#2d1b3d] px-4 py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated plane trails */}
        <motion.div
          className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Plane className="w-16 h-16 text-indigo-400 mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-indigo-100 to-blue-100 bg-clip-text text-transparent">
            Your Journey Begins Here
          </h1>
          <p className="text-indigo-200/90 text-xl md:text-2xl font-light max-w-2xl mx-auto">
            Discover amazing destinations with the best flight deals. Book now and save up to 40%!
          </p>
        </motion.div>

        {/* Main Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-blue-400/5 to-purple-500/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>

          <div className="relative z-10">
            {/* Trip Type Toggle */}
            <div className="flex items-center justify-center gap-2 mb-8 p-1 bg-white/5 rounded-2xl w-fit mx-auto">
              {(["one-way", "round-trip"] as TripType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    tripType === type
                      ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {type === "one-way" ? "One Way" : "Round Trip"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Airport Selection Row */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AirportInput
                    label="From"
                    value={from}
                    onInputChange={(val) => setFrom(val)}
                    onSelect={(iata) => setFrom(iata)}
                  />
                </motion.div>

                {/* Swap Button */}
                <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <motion.button
                    type="button"
                    onClick={swapAirports}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all backdrop-blur-sm shadow-lg"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Mobile Swap Button */}
                <div className="md:hidden flex justify-center -mt-2 -mb-2">
                  <motion.button
                    type="button"
                    onClick={swapAirports}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all backdrop-blur-sm"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* To */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AirportInput
                    label="To"
                    value={to}
                    onInputChange={(val) => setTo(val)}
                    onSelect={(iata) => setTo(iata)}
                  />
                </motion.div>
              </div>

              {/* Dates and Options Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Departure Date */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col"
                >
                  <label className="flex items-center gap-2 text-white/95 text-sm font-semibold mb-2.5 tracking-wide">
                    <Calendar className="w-4 h-4 text-indigo-300" />
                    Departure
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl text-white px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/60 transition-all backdrop-blur-md font-medium"
                    required
                  />
                </motion.div>

                {/* Return Date - Conditional */}
                <AnimatePresence>
                  {tripType === "round-trip" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col"
                    >
                      <label className="flex items-center gap-2 text-white/95 text-sm font-semibold mb-2.5 tracking-wide">
                        <Calendar className="w-4 h-4 text-indigo-300" />
                        Return
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={date}
                        className="w-full bg-white/10 border border-white/20 rounded-2xl text-white px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/60 transition-all backdrop-blur-md font-medium"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Passengers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col"
                >
                  <label className="flex items-center gap-2 text-white/95 text-sm font-semibold mb-2.5 tracking-wide">
                    <Users className="w-4 h-4 text-indigo-300" />
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl text-white px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/60 transition-all backdrop-blur-md font-medium appearance-none cursor-pointer"
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i + 1} className="text-gray-900 bg-white">
                        {i + 1} {i === 0 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Flight Class */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col"
                >
                  <label className="flex items-center gap-2 text-white/95 text-sm font-semibold mb-2.5 tracking-wide">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    Class
                  </label>
                  <select
                    value={flightClass}
                    onChange={(e) => setFlightClass(e.target.value as FlightClass)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl text-white px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/60 transition-all backdrop-blur-md font-medium appearance-none cursor-pointer capitalize"
                  >
                    <option value="economy" className="text-gray-900 bg-white">Economy</option>
                    <option value="business" className="text-gray-900 bg-white">Business</option>
                    <option value="first" className="text-gray-900 bg-white">First Class</option>
                  </select>
                </motion.div>
              </div>

              {/* Additional Options */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-white/80 text-sm cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={flexibleDates}
                    onChange={(e) => setFlexibleDates(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-400 cursor-pointer"
                  />
                  <Clock className="w-4 h-4 text-indigo-300" />
                  <span className="group-hover:text-white transition-colors">Flexible dates (±3 days)</span>
                </motion.label>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex-1 max-w-xs"
                >
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <Gift className="w-4 h-4 text-indigo-300" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="bg-transparent text-white placeholder-white/40 focus:outline-none text-sm flex-1"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Search className="w-5 h-5 relative z-10" />
                <span className="relative z-10">
                  {isSubmitting ? "Searching..." : "Search Flights"}
                </span>
                {isSubmitting && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="relative z-10 ml-2"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center text-red-200 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        {/* Trust Badges & Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Shield, text: "Secure Booking", subtext: "SSL Encrypted" },
            { icon: TrendingDown, text: "Best Prices", subtext: "Price Match Guarantee" },
            { icon: CheckCircle2, text: "24/7 Support", subtext: "Always Here to Help" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <item.icon className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{item.text}</div>
                <div className="text-white/60 text-xs">{item.subtext}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
