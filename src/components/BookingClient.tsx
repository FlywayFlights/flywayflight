"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function BookingClient({ summary }: { summary: any }) {
  const router = useRouter();
  const { setTicket } = useBooking();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await new Promise((res) => setTimeout(res, 700));

      const mergedTicket = {
        ...summary,
        ...form,
        pnr: generatePNR(),
        bookingNo: generateBookingNo(),
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
    <div className="max-w-2xl mx-auto py-10 px-5">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Passenger Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6 border-b pb-3 text-center">
            <p className="font-medium">
              {summary.airline} – Flight {summary.flight_number}
            </p>
            <p className="text-sm text-muted-foreground">
              {summary.from} → {summary.to} • {summary.date} at {summary.time}
            </p>
            <p className="text-primary mt-1 font-semibold">{summary.price}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
                placeholder="Male / Female / Other"
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                required
                value={form.age}
                onChange={handleChange}
                placeholder="Your age"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            {message && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}

            <Button type="submit" disabled={submitting} className="w-full mt-4">
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
