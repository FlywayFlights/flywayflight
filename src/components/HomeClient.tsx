// components/HomeClient.tsx
"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import PopularRoutes from "@/components/PopularRoute";
import ResultsSection from "@/components/ResultSection";

export default function HomeClient() {
  const [results, setResults] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
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
          onFinish={(res: any, metaObj: any) => {
            setLoading(false);
            setResults(res || []);
            setMeta(metaObj || null);
          }}
        />
        <PopularRoutes />
        <ResultsSection results={results} loading={loading} meta={meta} />
      </main>
    </div>
  );
}