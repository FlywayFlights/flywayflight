import "./globals.css";
import { Metadata } from "next";
import { BookingProvider } from "@/context/BookingContext";

export const metadata: Metadata = {
  title: "Flight Booking",
  description: "Search India & global flights at best prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app in the BookingProvider */}
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
