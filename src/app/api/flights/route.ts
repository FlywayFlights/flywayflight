// app/api/flights/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Get parameters that SearchSection sends
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const passengers = searchParams.get('passengers') || '1';

  console.log('Received params:', { from, to, date, passengers });

  // Validate required parameters
  if (!from || !to || !date) {
    return NextResponse.json(
      { error: 'Missing required parameters: from, to, date' },
      { status: 400 }
    );
  }

  const apiKey = process.env.SERPAPI_KEY;
  
  if (!apiKey) {
    console.error('SERPAPI_KEY is missing from environment variables');
    return NextResponse.json(
      { error: 'SERPAPI_KEY not configured in environment variables' },
      { status: 500 }
    );
  }

  try {
    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Build SerpAPI URL with correct parameters
    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.set('engine', 'google_flights');
    serpApiUrl.searchParams.set('departure_id', from.toUpperCase());
    serpApiUrl.searchParams.set('arrival_id', to.toUpperCase());
    serpApiUrl.searchParams.set('outbound_date', date);
    serpApiUrl.searchParams.set('adults', passengers);
    serpApiUrl.searchParams.set('currency', 'INR');
    serpApiUrl.searchParams.set('hl', 'en');
    serpApiUrl.searchParams.set('api_key', apiKey);
    serpApiUrl.searchParams.set('type', '2'); // 2 = One way, 1 = Round trip

    const urlForLogging = serpApiUrl.toString().replace(apiKey, 'HIDDEN_KEY');
    console.log('Fetching from SerpAPI:', urlForLogging);

    const response = await fetch(serpApiUrl.toString());

    console.log('SerpAPI Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SerpAPI error response:', errorText);
      
      // Try to parse error as JSON
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorJson.error || `SerpAPI Error: ${response.statusText}`, details: errorJson },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: `SerpAPI request failed: ${response.statusText}`, details: errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('SerpAPI returned data keys:', Object.keys(data));
    
    // Check for API errors
    if (data.error) {
      console.error('SerpAPI returned error:', data.error);
      return NextResponse.json(
        { error: data.error },
        { status: 400 }
      );
    }

    // Check if we have flight data
    if (!data.best_flights && !data.other_flights) {
      console.log('No flights found in response');
      return NextResponse.json({
        results: [],
        meta: {
          message: 'No flights found for this route',
          search_parameters: data.search_parameters
        }
      });
    }

    // Transform the data to match our frontend expectations
    const bestFlights = data.best_flights || [];
    const otherFlights = data.other_flights || [];
    const allFlights = [...bestFlights, ...otherFlights];

    console.log(`Found ${allFlights.length} flights`);

    // Transform flight data to a consistent format
    const transformedResults = allFlights.map((flight: any, index: number) => {
      const firstFlight = flight.flights?.[0] || {};
      const lastFlight = flight.flights?.[flight.flights.length - 1] || {};

      return {
        id: `flight-${index}`,
        airline: firstFlight.airline || 'Unknown',
        airline_logo: firstFlight.airline_logo || '',
        price: flight.price ? `₹${flight.price.toLocaleString()}` : 'N/A',
        duration: `${Math.floor(flight.total_duration / 60)}h ${flight.total_duration % 60}m`,
        stops: flight.flights?.length - 1 || 0,
        booking_token: flight.departure_token || '',
        segments: flight.flights?.map((f: any) => ({
          airline: f.airline,
          flight_number: f.flight_number,
          departure_airport: f.departure_airport?.id || '',
          arrival_airport: f.arrival_airport?.id || '',
          departure_time: f.departure_airport?.time || '',
          arrival_time: f.arrival_airport?.time || '',
          duration: f.duration,
          travel_class: f.travel_class
        })) || [],
        carbon_emissions: flight.carbon_emissions,
        layovers: flight.layovers || []
      };
    });

    return NextResponse.json({
      results: transformedResults,
      meta: {
        search_metadata: data.search_metadata,
        search_parameters: data.search_parameters,
        total_results: transformedResults.length
      }
    });

  } catch (error: any) {
    console.error('Flight API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights', details: error.message },
      { status: 500 }
    );
  }
}