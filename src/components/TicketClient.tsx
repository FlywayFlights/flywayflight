"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Ticket = {
  name?: string;
  gender?: string;
  age?: string;
  phone?: string;
  email?: string;
  airline?: string;
  flight_number?: string;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  price?: string;
};

export default function TicketClient({ ticket }: { ticket: Ticket }) {
  const router = useRouter();

  function handleDownload() {
    window.print();
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">E‑Ticket Confirmation</h1>
          <p className="text-muted-foreground mt-1">Your airline e‑ticket details</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden border-dashed border-2">
            <CardContent className="p-0">
              {/* Ticket Header */}
              <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
                <div className="text-lg font-semibold">{ticket.airline || "Airline"}</div>
                <div className="text-xs opacity-90">E‑TICKET</div>
              </div>

              {/* Body with two columns */}
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left column: Passenger */}
                <div className="md:col-span-2 p-6 space-y-4">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">Passenger</div>
                    <div className="text-base font-medium">{ticket.name || "—"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Gender</div>
                      <div className="font-medium">{ticket.gender || "—"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Age</div>
                      <div className="font-medium">{ticket.age || "—"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Phone</div>
                      <div className="font-medium">{ticket.phone || "—"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium break-all">{ticket.email || "—"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Flight No.</div>
                      <div className="font-semibold">{ticket.flight_number || "—"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-semibold">{ticket.date || "—"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Time</div>
                      <div className="font-semibold">{ticket.time || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* Right column: Route + Price + barcode */}
                <div className="border-t md:border-t-0 md:border-l p-6 flex flex-col gap-4">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground mb-1">Route</div>
                    <div className="text-xl font-bold tracking-wide">{ticket.from || "—"} → {ticket.to || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground mb-1">Price</div>
                    <div className="text-2xl font-extrabold text-primary">{ticket.price || "—"}</div>
                  </div>
                  <div className="mt-auto">
                    <div className="text-xs uppercase text-muted-foreground mb-2">Boarding Code</div>
                    <div
                      className="w-full h-20 bg-[repeating-linear-gradient(90deg,theme(colors.foreground)_0_2px,transparent_2px_6px)]
                                 dark:bg-[repeating-linear-gradient(90deg,theme(colors.foreground)_0_2px,transparent_2px_6px)]
                                 rounded"
                      aria-hidden
                    />
                    <div className="text-[10px] text-muted-foreground mt-2">Keep this code for verification at the gate</div>
                  </div>
                </div>
              </div>

              {/* Perforation footer */}
              <div className="px-6 py-4 border-t border-dashed flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Non-transferable • ID required • Subject to airline policies</div>
                <div className="hidden md:block w-24 h-6 rounded-full bg-[repeating-linear-gradient(90deg,theme(colors.muted.DEFAULT)_0_4px,transparent_4px_8px)]" />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-3">
            <Button size="lg" className="flex-1 md:flex-none" onClick={handleDownload}>Download Ticket</Button>
            <Button size="lg" variant="outline" className="flex-1 md:flex-none" onClick={() => router.push("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    </section>
  );
}


