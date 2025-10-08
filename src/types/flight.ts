// types/flight.ts
export interface Flight {
    flights: FlightLeg[];
    layovers?: Layover[];
    total_duration: number;
    carbon_emissions: {
      this_flight: number;
      typical_for_this_route: number;
      difference_percent: number;
    };
    price: number;
    type: string;
    airline_logo: string;
    departure_token: string;
  }
  
  export interface FlightLeg {
    departure_airport: Airport;
    arrival_airport: Airport;
    duration: number;
    airplane: string;
    airline: string;
    airline_logo: string;
    travel_class: string;
    flight_number: string;
    legroom: string;
    extensions: string[];
  }
  
  export interface Airport {
    name: string;
    id: string;
    time: string;
  }
  
  export interface Layover {
    duration: number;
    name: string;
    id: string;
  }