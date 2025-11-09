"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { Plane } from "lucide-react";
import { useEffect, useState } from "react";

export default function TicketClient() {
  const router = useRouter();
  const { ticket } = useBooking();
  const [pnr, setPnr] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  useEffect(() => {
    // Generate realistic PNR (6 alphanumeric characters)
    const generatePNR = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Generate realistic ticket number (13-14 digits)
    const generateTicketNumber = () => {
      const airline = "998"; // Airline code (3 digits)
      const document = Math.floor(Math.random() * 10000000000).toString().padStart(10, "0");
      return airline + document;
    };

    setPnr(ticket?.pnr || generatePNR());
    setTicketNumber(ticket?.ticketNumber || generateTicketNumber());
  }, [ticket]);

  function handleDownload() {
    window.print();
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

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            E-Ticket Confirmation
          </h1>
          <p className="text-muted-foreground text-sm">
            Please save this e-ticket for your records
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-0">
              {/* Airline Header */}
              <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white px-8 py-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64">
                    <Plane className="w-full h-full rotate-45" />
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Plane className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-wide">
                        {ticket.airline || "Airways"}
                      </div>
                      <div className="text-xs text-blue-200 tracking-wider">
                        ELECTRONIC TICKET
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-200 mb-1">Ticket Number</div>
                    <div className="text-sm font-mono tracking-wider">{ticketNumber}</div>
                  </div>
                </div>
              </div>

              {/* PNR and Important Info Bar */}
              <div className="bg-amber-400 text-amber-950 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-1">
                        Booking Reference (PNR)
                      </div>
                      <div className="text-3xl font-bold tracking-[0.3em] font-mono">
                        {pnr}
                      </div>
                    </div>
                    <div className="h-12 w-px bg-amber-600"></div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-1">
                        Status
                      </div>
                      <div className="text-lg font-bold">
                        CONFIRMED
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 bg-amber-950 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    BOOKING CONFIRMED
                  </div>
                </div>
              </div>

              {/* Main Ticket Body */}
              <div className="bg-white dark:bg-slate-900">
                {/* Flight Route Section */}
                <div className="px-8 py-8 border-b">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 text-center">
                      <div className="text-sm text-muted-foreground mb-2">DEPARTURE</div>
                      <div className="text-4xl font-bold mb-1">{ticket.from || "DEL"}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.date || "2025-11-16"}
                      </div>
                      <div className="text-2xl font-semibold mt-2">{ticket.time || "21:20"}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                      <div className="text-xs text-muted-foreground mb-2">FLIGHT DURATION</div>
                      <div className="w-full flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-600 to-blue-600 relative">
                          <Plane className="w-6 h-6 absolute left-1/2 -translate-x-1/2 -top-3 text-blue-600 rotate-90" />
                        </div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium">{ticket.duration || "2h 30m"}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">
                        {ticket.stops === 0 ? "DIRECT FLIGHT" : `${ticket.stops} STOP(S)`}
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      <div className="text-sm text-muted-foreground mb-2">ARRIVAL</div>
                      <div className="text-4xl font-bold mb-1">{ticket.to || "AMD"}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.arrivalDate || ticket.date || "2025-11-16"}
                      </div>
                      <div className="text-2xl font-semibold mt-2">{ticket.arrivalTime || "23:50"}</div>
                    </div>
                  </div>
                </div>

                {/* Passenger and Flight Details */}
                <div className="grid md:grid-cols-2 gap-8 px-8 py-8 border-b">
                  {/* Left Column - Passenger Info */}
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Passenger Information
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Name</span>
                          <span className="font-semibold">{ticket.name || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Gender</span>
                          <span className="font-semibold">{ticket.gender || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Age</span>
                          <span className="font-semibold">{ticket.age || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Contact Details
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <span className="font-semibold">{ticket.phone || "—"}</span>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b">
                          <span className="text-sm text-muted-foreground">Email</span>
                          <span className="font-semibold text-right text-sm break-all max-w-[200px]">
                            {ticket.email || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Flight Details */}
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Flight Details
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Flight Number</span>
                          <span className="font-semibold font-mono">{ticket.flight_number || "6E 7138"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Class</span>
                          <span className="font-semibold">{ticket.class || "Economy"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-muted-foreground">Seat</span>
                          <span className="font-semibold">{ticket.seat || "Will be assigned at check-in"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Fare Information
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Total Amount Paid</span>
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">PAID</span>
                        </div>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                          {ticket.price || "₹8,502"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barcode Section */}
                <div className="px-8 py-8 bg-slate-50 dark:bg-slate-800">
                  <div className="text-center mb-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Boarding Pass Barcode
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Present this barcode at the airport for check-in and boarding
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-2 border-dashed">
                      <div
                        className="w-80 h-24 bg-[repeating-linear-gradient(90deg,#000_0_3px,transparent_3px_7px)] dark:bg-[repeating-linear-gradient(90deg,#fff_0_3px,transparent_3px_7px)]"
                        aria-hidden="true"
                      />
                      <div className="text-center mt-3 text-xs font-mono tracking-wider text-muted-foreground">
                        {pnr}-{ticketNumber.slice(-6)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="px-8 py-6 bg-red-50 dark:bg-red-950/30 border-t-2 border-red-200 dark:border-red-900">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-bold text-red-900 dark:text-red-200 mb-1">Important Information</div>
                      <ul className="text-xs text-red-800 dark:text-red-300 space-y-1">
                        <li>• Check-in opens 2-3 hours before departure</li>
                        <li>• Carry valid government-issued photo ID</li>
                        <li>• Arrive at the airport at least 2 hours before departure</li>
                        <li>• This ticket is non-transferable and non-refundable</li>
                        <li>• Subject to airline terms and conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    Issued by: {ticket.airline || "Airways"} | Issue Date: {new Date().toLocaleDateString()}
                  </div>
                  <div className="font-mono">
                    Ref: {pnr}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 flex-col sm:flex-row justify-center">
            <Button
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleDownload}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download E-Ticket
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => router.push("/")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}