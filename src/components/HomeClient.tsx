// components/HomeClient.tsx
"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import PopularRoutes from "@/components/PopularRoute";
import ResultsSection from "@/components/ResultSection";
import type { Flight } from "@/types/flight";

export default function HomeClient() {
  const [results, setResults] = useState<Flight[]>([]);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SearchSection
          onStart={() => {
            setLoading(true);
            setResults([]);
            setMeta(null);
          }}
          onFinish={(res: unknown[], metaObj: unknown) => {
            setLoading(false);
            setResults((res as Flight[]) || []);
            setMeta((metaObj as Record<string, unknown>) || null);
          }}
        />
        <PopularRoutes />
        <ResultsSection results={results} loading={loading} meta={meta} />
      </main>
    </div>
  );
}