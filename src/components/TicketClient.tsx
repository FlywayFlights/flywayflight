"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { Plane, Clock, Shield, Luggage, AlertCircle, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadTicketPDF } from "@/lib/downloadTicketPDF";

export default function TicketClient() {
  const router = useRouter();
  const { ticket } = useBooking();
  const [pnr, setPnr] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  useEffect(() => {
    const generatePNR = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const generateTicketNumber = () => {
      const airline = "998";
      const document = Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(10, "0");
      return airline + document;
    };

    setPnr(ticket?.pnr || generatePNR());
    setTicketNumber(ticket?.ticketNumber || generateTicketNumber());
  }, [ticket]);

  async function handleDownload() {
    await downloadTicketPDF();
  }

  if (!ticket) {
    return (
      <section className="py-12 text-center">
        <p className="text-lg font-medium">
          No ticket data found. Redirecting...
        </p>
      </section>
    );
  }

  const safeTicket = ticket;
  const passengers = safeTicket.passengers || [
    {
      name: safeTicket.name,
      gender: safeTicket.gender,
      age: safeTicket.age,
      seat: safeTicket.seat,
      class: safeTicket.class,
    },
  ];

  // Calculate pricing display
  const passengerCount = safeTicket.totalPassengers || safeTicket.passengerCount || passengers.length || 1;
  const pricePerPassenger = safeTicket.price_per_passenger || "₹0";
  const totalPrice = safeTicket.price || "₹0";
  const originalPricePerPassenger = safeTicket.original_price_per_passenger || safeTicket.original_price || "₹0";
  
  // Extract numeric values
  const pricePerPassengerNum = Number(pricePerPassenger.replace(/[^\d]/g, "")) || 0;
  const totalPriceNum = Number(totalPrice.replace(/[^\d]/g, "")) || 0;
  
  // If total price is not set but per-passenger is, calculate it
  const calculatedTotalPrice = totalPriceNum > 0 ? totalPrice : `₹${(pricePerPassengerNum * passengerCount).toLocaleString()}`;

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            E-Ticket Confirmation
          </h1>
          <p className="text-muted-foreground text-sm">
            One booking — multiple passengers. Ready to fly!
          </p>
        </div>

        <div className="max-w-4xl mx-auto" id="ticket-section">
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-0">
              <div className="p-4">
                {/* Airline Header */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white px-8 py-6 relative">
                  <div className="absolute inset-0 opacity-10">
                    <Plane className="absolute w-64 h-64 rotate-45 right-0 top-0" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Plane className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tracking-wide">
                          {safeTicket.airline || "Airways"}
                        </div>
                        <div className="text-xs text-blue-200 tracking-wider">
                          ELECTRONIC TICKET
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-200 mb-1">
                        Ticket Number
                      </div>
                      <div className="text-sm font-mono tracking-wider">
                        {ticketNumber}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Route Section */}
                <div className="px-8 py-8 border-b bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="text-sm text-muted-foreground mb-1">
                        FROM
                      </div>
                      <div className="text-4xl font-bold mb-1">
                        {safeTicket.from || "DEL"}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {safeTicket.date || "—"}
                      </div>
                      {safeTicket.time && (
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {safeTicket.time}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-600 to-blue-600 relative">
                          <Plane className="w-6 h-6 absolute left-1/2 -translate-x-1/2 -top-3 text-blue-600 rotate-90" />
                        </div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium">
                        {safeTicket.duration || "—"}
                      </div>
                      <div className="text-xs text-green-600 font-medium mt-1">
                        {safeTicket.stops === 0
                          ? "DIRECT FLIGHT"
                          : `${safeTicket.stops || 0} STOP(S)`}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-sm text-muted-foreground mb-1">
                        TO
                      </div>
                      <div className="text-4xl font-bold mb-1">
                        {safeTicket.to || "BOM"}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {safeTicket.arrivalDate || safeTicket.date || "—"}
                      </div>
                      {safeTicket.arrivalTime && (
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {safeTicket.arrivalTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Passenger List */}
                <div className="px-8 py-8 border-b bg-slate-50 dark:bg-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Passenger List
                  </div>
                  <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 dark:bg-slate-700 text-left">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Gender</th>
                          <th className="p-3">Age</th>
                          <th className="p-3">Class</th>
                          <th className="p-3">Seat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passengers.map((p, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-200 dark:border-slate-700"
                          >
                            <td className="p-3 font-medium">{i + 1}</td>
                            <td className="p-3">{p.name || "—"}</td>
                            <td className="p-3">{p.gender || "—"}</td>
                            <td className="p-3">{p.age || "—"}</td>
                            <td className="p-3">{p.class || "Economy"}</td>
                            <td className="p-3">
                              {p.seat || "Assign at check-in"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pricing Breakdown */}
                <div className="px-8 py-8 border-b bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Pricing Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Price per Passenger</span>
                      <div className="flex items-center gap-2">
                        {originalPricePerPassenger !== pricePerPassenger && (
                          <span className="text-sm text-gray-400 line-through">
                            {originalPricePerPassenger}
                          </span>
                        )}
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {pricePerPassenger}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Number of Passengers
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {passengerCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-white dark:bg-slate-900 rounded-lg px-4 mt-4 border-2 border-indigo-200 dark:border-indigo-800">
                      <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                        Total Amount Paid
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {calculatedTotalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shared Info */}
                <div className="grid md:grid-cols-2 gap-8 px-8 py-8 border-b bg-white dark:bg-slate-900">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Contact Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b py-1">
                        <span>Phone</span>
                        <span>{passengers[0]?.phone || safeTicket.phone || "—"}</span>
                      </div>
                      <div className="flex justify-between border-b py-1">
                        <span>Email</span>
                        <span className="text-right break-all max-w-[200px]">
                          {passengers[0]?.email || safeTicket.email || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Booking Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b py-1">
                        <span>Flight Number</span>
                        <span className="font-mono">
                          {safeTicket.flight_number || "6E7138"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b py-1">
                        <span>Booking Reference (PNR)</span>
                        <span className="font-mono tracking-[0.15em]">{pnr}</span>
                      </div>
                      <div className="flex justify-between border-b py-1">
                        <span>Total Passengers</span>
                        <span className="font-semibold">
                          {passengerCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flight Guidelines */}
                <div className="px-8 py-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border-b">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Important Flight Guidelines & Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Check-in Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Check-in Information</h4>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>Online check-in opens 48 hours before departure and closes 2 hours before flight time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>Airport check-in counters close 60 minutes before scheduled departure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>Arrive at the airport at least 2 hours before domestic flights</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>Gate closes 20 minutes before departure - late passengers will not be accommodated</span>
                        </li>
                      </ul>
                    </div>

                    {/* Baggage Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Luggage className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Baggage Allowance</h4>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span><strong>Hand Baggage:</strong> 1 piece, max 7 kg (15 lbs), dimensions 115 cm (L+W+H)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span><strong>Checked Baggage:</strong> As per fare type (15-20 kg for Economy)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span>Excess baggage charges apply at ₹500-800 per kg</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span>Prohibited items: Liquids over 100ml, sharp objects, flammable materials</span>
                        </li>
                      </ul>
                    </div>

                    {/* Security Guidelines */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Security Guidelines</h4>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                          <span>Valid government-issued photo ID required (Aadhaar, Passport, Driving License)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                          <span>Liquids in carry-on must be in containers of 100ml or less, in a clear resealable bag</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                          <span>Remove laptops, tablets, and large electronics for separate screening</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                          <span>No weapons, tools, or sharp objects in carry-on baggage</span>
                        </li>
                      </ul>
                    </div>

                    {/* Boarding & Travel Tips */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Plane className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Boarding & Travel Tips</h4>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                          <span>Boarding begins 40 minutes before departure - listen for announcements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                          <span>Keep your boarding pass and ID ready at all times</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                          <span>Seat numbers will be assigned at check-in if not pre-selected</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                          <span>Flight delays or cancellations will be notified via SMS/Email</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Important Reminders */}
                  <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-red-800 dark:text-red-300 mb-2">Important Reminders</h4>
                        <ul className="space-y-1 text-xs text-red-700 dark:text-red-400">
                          <li>• This is an electronic ticket - no physical ticket required. Present valid ID at check-in.</li>
                          <li>• Name changes are not permitted. Ensure all passenger names match exactly as per government ID.</li>
                          <li>• Cancellation and refund policies vary by fare type. Check terms at time of booking.</li>
                          <li>• Web check-in is mandatory for all passengers. Complete it 48 hours to 2 hours before departure.</li>
                          <li>• In case of flight cancellation, you will be rebooked on the next available flight or receive a full refund.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Customer Support */}
                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Need Assistance?
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-xs text-blue-700 dark:text-blue-400">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span><strong>24/7 Helpline:</strong> +91-1800-XXX-XXXX</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span><strong>Email:</strong> support@booflight.com</span>
                      </div>
                      <div className="sm:col-span-2 text-xs text-blue-600 dark:text-blue-500">
                        For flight status, cancellations, or booking modifications, contact our customer service team.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4 flex-col sm:flex-row justify-center">
            <button
              className="font-semibold rounded-lg transition-all active:scale-95 px-6 py-3 text-lg gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center"
              onClick={handleDownload}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download E-Ticket
            </button>

            <button
              className="font-semibold rounded-lg transition-all active:scale-95 px-6 py-3 text-lg gap-2 border border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
              onClick={() => router.push("/")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
