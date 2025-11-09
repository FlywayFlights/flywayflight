// types/flight.ts
export interface FlightSegment {
  airline?: string;
  flight_number?: string;
  departure_airport?: string;
  arrival_airport?: string;
  departure_time?: string;
  arrival_time?: string;
  duration?: number;
  travel_class?: string;
}

export interface CarbonEmissions {
  this_flight?: number;
  typical_for_this_route?: number;
  difference_percent?: number;
}

export interface Layover {
  duration?: number;
  name?: string;
  id?: string;
}

export interface Flight {
  id: string;
  airline?: string;
  airline_logo?: string;
  price?: string;
  duration?: string;
  stops?: number;
  booking_token?: string;
  segments?: FlightSegment[];
  carbon_emissions?: CarbonEmissions;
  layovers?: Layover[];
}

export interface BookingOption {
  id: string;
  source: string;
  price: string;
  link: string;
  type: string;
  provider: string;
  fare_type: string;
}
