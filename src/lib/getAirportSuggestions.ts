// lib/getAirportSuggestions.ts

export interface Airport {
  iata: string;
  city: string;
  name: string;
  country?: string; // ISO-2 from public dataset
}

let airportCache: Airport[] | null = null;
let loadPromise: Promise<Airport[]> | null = null;

async function loadAirports(): Promise<Airport[]> {
  if (airportCache) return airportCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    // Fetch from public/airport.json at runtime (client)
    const res = await fetch("/airport.json", { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load airports: ${res.status}`);
    const data = (await res.json()) as Array<{
      code?: string;
      name?: string;
      city?: string;
      country?: string;
    }>;
    // Map to unified shape
    airportCache = data
      .filter((a) => a && a.code && a.name)
      .map((a) => ({
        iata: String(a.code),
        name: String(a.name),
        city: a.city ? String(a.city) : "",
        country: a.country ? String(a.country) : undefined,
      }));
    return airportCache;
  })();

  return loadPromise;
}

export async function getAirportSuggestions(query: string): Promise<Airport[]> {
  if (!query || query.length < 2) return [];
  const airports = await loadAirports();
  const q = query.toLowerCase();
  return airports
    .filter(
      (a) =>
        a.city?.toLowerCase().includes(q) ||
        a.iata?.toLowerCase().includes(q) ||
        a.name?.toLowerCase().includes(q) ||
        a.country?.toLowerCase().includes(q)
    )
    .slice(0, 8);
}
