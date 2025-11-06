import BookingClient from "@/components/BookingClient";

export default function BookingPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const get = (k: string) => {
    const v = searchParams?.[k];
    return Array.isArray(v) ? v[0] : v || "";
  };

  const summary = {
    airline: get("airline"),
    from: get("from"),
    to: get("to"),
    date: get("date"),
    time: get("time"),
    duration: get("duration"),
    price: get("price"),
  };

  return <BookingClient summary={summary} />;
}


