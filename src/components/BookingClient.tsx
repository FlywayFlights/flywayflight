"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking, Ticket } from "@/context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";

function generatePNR() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateBookingNo() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let booking = "NN";
  for (let i = 0; i < 16; i++) {
    booking += chars[Math.floor(Math.random() * chars.length)];
  }
  return booking;
}

export default function BookingClient({ summary }: { summary: Ticket }) {
  const router = useRouter();
  const { setTicket } = useBooking();

  // Initialize passengers based on the count from search
  const initialPassengerCount = summary.totalPassengers || summary.passengerCount || summary.passengers?.length || 1;
  const [passengers, setPassengers] = useState(() => {
    // If passengers array exists and has data, use it; otherwise create empty slots
    if (summary.passengers && summary.passengers.length > 0) {
      return summary.passengers.map(p => ({
        name: p.name || "",
        gender: p.gender || "",
        age: p.age || "",
        phone: p.phone || "",
        email: p.email || "",
      }));
    }
    // Create empty passenger slots based on count
    return Array.from({ length: initialPassengerCount }, () => ({
      name: "",
      gender: "",
      age: "",
      phone: "",
      email: "",
    }));
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Calculate pricing - handle both per-passenger and total prices
  const currentPassengerCount = summary.totalPassengers || summary.passengerCount || 1;
  
  // Get per-passenger prices if available, otherwise calculate from total
  let pricePerPassengerNum = 0;
  let originalPricePerPassengerNum = 0;
  
  if (summary.price_per_passenger) {
    pricePerPassengerNum = Number(summary.price_per_passenger.replace(/[^\d]/g, "")) || 0;
  } else if (summary.price) {
    // If only total price is available, divide by original passenger count
    const totalPriceNum = Number(summary.price.replace(/[^\d]/g, "")) || 0;
    pricePerPassengerNum = currentPassengerCount > 0 ? Math.round(totalPriceNum / currentPassengerCount) : totalPriceNum;
  }
  
  if (summary.original_price_per_passenger) {
    originalPricePerPassengerNum = Number(summary.original_price_per_passenger.replace(/[^\d]/g, "")) || 0;
  } else if (summary.original_price) {
    const totalOriginalNum = Number(summary.original_price.replace(/[^\d]/g, "")) || 0;
    originalPricePerPassengerNum = currentPassengerCount > 0 ? Math.round(totalOriginalNum / currentPassengerCount) : totalOriginalNum;
  }
  
  // Calculate totals based on current passenger count in form
  const totalPrice = pricePerPassengerNum * passengers.length;
  const totalOriginalPrice = originalPricePerPassengerNum * passengers.length;
  
  const formattedTotalPrice = `₹${totalPrice.toLocaleString()}`;
  const formattedTotalOriginalPrice = `₹${totalOriginalPrice.toLocaleString()}`;
  const formattedPricePerPassenger = `₹${pricePerPassengerNum.toLocaleString()}`;
  const formattedOriginalPerPassenger = `₹${originalPricePerPassengerNum.toLocaleString()}`;

  function handleChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setPassengers(updated);
  }

  function addPassenger() {
    setPassengers([
      ...passengers,
      { name: "", gender: "", age: "", phone: "", email: "" },
    ]);
  }

  function removePassenger(index: number) {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await new Promise((res) => setTimeout(res, 700));
      const mergedTicket = {
        ...summary,
        passengers,
        pnr: generatePNR(),
        bookingNo: generateBookingNo(),
        totalPassengers: passengers.length,
        passengerCount: passengers.length,
        price: formattedTotalPrice, // Update to total price
        price_per_passenger: formattedPricePerPassenger, // Preserve per-passenger price
        original_price: formattedTotalOriginalPrice, // Update to total original price
        original_price_per_passenger: formattedOriginalPerPassenger, // Preserve per-passenger original
      };

      setTicket(mergedTicket);
      router.push("/ticket");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 px-6 text-center shadow-md">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
            Passenger Information
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            Please enter details for all passengers before confirming your
            booking
          </p>
        </div>

        <div className="p-6">
          {/* Flight Summary */}
          <div className="mb-6 text-center border-b border-gray-200 pb-4">
            <p className="font-semibold text-gray-900">
              {summary.airline} — Flight {summary.flight_number}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {summary.from} → {summary.to} • {summary.date} at {summary.time}
            </p>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Price per passenger:</span>
                {originalPricePerPassengerNum > 0 && (
                  <span className="line-through text-gray-400">{formattedOriginalPerPassenger}</span>
                )}
                <span className="font-semibold text-blue-600">{formattedPricePerPassenger}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">Total for {passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'}:</span>
                {totalOriginalPrice > 0 && (
                  <span className="line-through text-gray-400 text-sm">{formattedTotalOriginalPrice}</span>
                )}
                <span className="text-blue-600 font-bold text-xl">{formattedTotalPrice}</span>
              </div>
              {passengers.length !== currentPassengerCount && (
                <p className="text-xs text-amber-600 mt-2">
                  Note: Price updated for {passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'}
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence initial={false}>
              {passengers.map((p, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-xl p-4 relative shadow-sm hover:shadow-md transition-all bg-white/70 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Passenger {index + 1}
                    </h3>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        name="name"
                        required
                        type="text"
                        value={p.name}
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
                      />
                    </div>

                    {/* Gender (Dropdown) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        required
                        value={p.gender}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Age */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <input
                        name="age"
                        required
                        type="number"
                        value={p.age}
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Enter age"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        name="phone"
                        required
                        type="text"
                        value={p.phone}
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Enter phone number"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        name="email"
                        required
                        type="email"
                        value={p.email}
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Enter email address"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Passenger Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addPassenger}
                className="mt-2 text-indigo-600 font-medium hover:text-indigo-800 transition"
              >
                + Add Another Passenger
              </motion.button>
            </div>

            {message && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium rounded-lg py-3 mt-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
            >
              {submitting
                ? "Booking..."
                : `Confirm Booking for ${passengers.length} Passenger${
                    passengers.length > 1 ? "s" : ""
                  }`}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
