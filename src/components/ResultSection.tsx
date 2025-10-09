// components/ResultsSection.tsx
import FlightCard from "@/components/FlightCard";
import { Plane, Filter } from "lucide-react";
import { Flight } from "@/types/flight";

interface ResultsSectionProps {
  results?: Flight[];
  loading?: boolean;
  meta?: Record<string, unknown> | null;
}

export default function ResultsSection({ results = [], loading = false }: ResultsSectionProps) {
  if (!loading && results.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
            <Plane className="w-8 h-8 text-primary" />
            {loading ? "Searching Flights..." : "Available Flights"}
          </h2>
          <p className="text-muted-foreground">
            {loading 
              ? "Please wait while we search for the best flight deals..." 
              : `Found ${results.length} flight${results.length !== 1 ? 's' : ''} for your journey`
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg p-6 border shadow-sm sticky top-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Stops</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Non-stop</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>1 Stop</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>2+ Stops</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 text-sm">Price Range</h4>
                  <p className="text-xs text-muted-foreground mb-2">₹5,000 - ₹50,000</p>
                  <input type="range" className="w-full" min="5000" max="50000" />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 text-sm">Airlines</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>All Airlines</span>
                    </label>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-4 border-t">
                  Filters coming soon! Results are currently unfiltered.
                </p>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-10 bg-muted rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Plane className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No flights found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 bg-card rounded-lg p-4 border">
                  <div className="text-sm font-medium">
                    Showing {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                  <select className="text-sm border rounded-md px-3 py-1.5 bg-background">
                    <option>Sort by: Best</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Duration: Shortest</option>
                    <option>Departure: Earliest</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}