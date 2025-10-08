// app/page.tsx
import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";
export default function Home() {
  return <HomeClient />;
}

// Optional: Add metadata for SEO
export const metadata: Metadata = {
  title: "BoofLight - Find the Best Flight Deals",
  description: "Search and compare flights from top airlines. Book your perfect flight with BoofLight.",
};