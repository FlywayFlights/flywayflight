// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
