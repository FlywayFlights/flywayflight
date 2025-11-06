"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Summary = {
  airline?: string;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  duration?: string;
  price?: string;
};

export default function BookingClient({ summary }: { summary: Summary }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      // Placeholder submission; integrate with your booking API if desired
      await new Promise((r) => setTimeout(r, 800));
      const params = new URLSearchParams({
        name: form.name,
        gender: form.gender,
        age: form.age,
        phone: form.phone,
        email: form.email,
        airline: fallback.airline,
        flight_number: new URLSearchParams(window.location.search).get("flight_number") || "",
        from: fallback.from,
        to: fallback.to,
        date: fallback.date,
        time: fallback.time,
        price: fallback.price,
      });
      router.push(`/ticket?${params.toString()}`);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fallback = {
    airline: summary.airline || "Sample Air",
    from: summary.from || "AAA",
    to: summary.to || "BBB",
    date: summary.date || new Date().toISOString().slice(0, 10),
    time: summary.time || "10:00",
    duration: summary.duration || "2h 35m",
    price: summary.price || "$199",
  };

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Secure Your Booking</h1>
          <p className="text-muted-foreground mt-1">Enter passenger details and review your flight</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80">
              <CardHeader>
                <CardTitle className="text-xl">Passenger Details</CardTitle>
                <CardDescription>Enter the passenger information as it appears on the ID/passport.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={onChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input
                      name="age"
                      type="number"
                      min={0}
                      placeholder="28"
                      value={form.age}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+1 555 123 4567"
                      value={form.phone}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={form.email}
                      onChange={onChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 mt-2 flex items-center gap-3">
                    <Button type="submit" size="lg" disabled={submitting} className="w-full md:w-auto">
                      {submitting ? "Saving..." : "Continue"}
                    </Button>
                    <span className="text-xs text-muted-foreground">Your data is encrypted and secure.</span>
                  </div>
                </form>
              </CardContent>
              {message && (
                <CardFooter>
                  <p className="text-sm text-muted-foreground">{message}</p>
                </CardFooter>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <Card className="border-primary/10 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Flight Summary</CardTitle>
                  <CardDescription>Your selected flight details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Airline</span>
                      <span className="font-medium">{fallback.airline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Route</span>
                      <span className="font-medium">{fallback.from} → {fallback.to}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{fallback.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{fallback.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{fallback.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-primary">{fallback.price}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">Proceed to Payment</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


