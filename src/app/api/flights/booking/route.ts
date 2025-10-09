// app/api/flights/booking/route.ts
import { NextResponse } from "next/server";

interface BookingOption {
  source?: string;
  price?: number;
  link?: string;
  type?: string;
}

interface SerpApiBookingResponse {
  error?: string;
  booking_options?: BookingOption[];
  search_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  
  if (!token) {
    return NextResponse.json(
      { error: "Missing booking token" }, 
      { status: 400 }
    );
  }

  const apiKey = process.env.SERPAPI_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "SERPAPI_KEY not configured in environment variables" }, 
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      engine: "google_flights",
      booking_token: token,
      api_key: apiKey
    });

    console.log('Fetching booking options for token:', token.substring(0, 20) + '...');

    const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('SerpAPI booking error:', errorText);
      return NextResponse.json(
        { error: `SerpAPI request failed: ${res.statusText}` }, 
        { status: res.status }
      );
    }

    const json: SerpApiBookingResponse = await res.json();

    // Check for API errors
    if (json.error) {
      return NextResponse.json(
        { error: json.error },
        { status: 400 }
      );
    }

    // Transform booking options to a consistent format
    const bookingOptions = (json.booking_options || []).map((option: BookingOption, index: number) => ({
      id: `booking-${index}`,
      source: option.source || 'Unknown',
      price: option.price ? `₹${option.price}` : 'N/A',
      link: option.link || '#',
      type: option.type || 'Standard'
    }));

    console.log(`Found ${bookingOptions.length} booking options`);

    return NextResponse.json({ 
      booking_options: bookingOptions,
      search_metadata: json.search_metadata,
      raw: json // Keep raw data for debugging
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Booking API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking options', details: errorMessage },
      { status: 500 }
    );
  }
}