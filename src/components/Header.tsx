"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plane } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md text-gray-800"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Plane className="w-6 h-6 text-blue-600" />
          <span className={isScrolled ? "text-blue-700" : "text-white"}>
            BoofLight
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#"
            className={`hover:text-blue-600 transition-colors ${
              isScrolled ? "text-gray-700" : "text-gray-100"
            }`}
          >
            Flights
          </Link>
          <Link
            href="#"
            className={`hover:text-blue-600 transition-colors ${
              isScrolled ? "text-gray-700" : "text-gray-100"
            }`}
          >
            Hotels
          </Link>
          <Link
            href="#"
            className={`hover:text-blue-600 transition-colors ${
              isScrolled ? "text-gray-700" : "text-gray-100"
            }`}
          >
            Packages
          </Link>
          <Link
            href="#"
            className={`hover:text-blue-600 transition-colors ${
              isScrolled ? "text-gray-700" : "text-gray-100"
            }`}
          >
            Deals
          </Link>
        </nav>

        {/* Sign In Button */}
        <Button
          variant={isScrolled ? "primary" : "outline"}
          className={`text-sm px-5 py-2 font-semibold rounded-full transition-all ${
            isScrolled
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border border-white text-white hover:bg-white hover:text-blue-700"
          }`}
        >
          Sign In
        </Button>
      </div>
    </header>
  );
}
