import TicketClient from "@/components/TicketClient";

export default function TicketPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const get = (k: string) => {
    const v = searchParams?.[k];
    return Array.isArray(v) ? v[0] : v || "";
  };

  const ticket = {
    name: get("name"),
    gender: get("gender"),
    age: get("age"),
    phone: get("phone"),
    email: get("email"),
    airline: get("airline"),
    flight_number: get("flight_number"),
    from: get("from"),
    to: get("to"),
    date: get("date"),
    time: get("time"),
    price: get("price"),
  };

  return <TicketClient ticket={ticket} />;
}


