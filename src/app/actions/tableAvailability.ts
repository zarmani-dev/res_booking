import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

export async function getTableStatusForDate(date: Date) {
  const supabase = createClient();
  const formattedDate = format(date, "yyyy-MM-dd");

  // First get all tables
  const { data: tables } = await supabase
    .from("tables")
    .select("*")
    .order("id");

  // Then get reservations for the specific date
  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("reservation_date", formattedDate)
    .in("status", ["confirmed", "pending"]);

  // Map tables with their reservation status for the selected date
  const tablesWithStatus = tables?.map((table) => {
    const tableReservations = reservations?.filter(
      (res) => res.table_id === table.id
    );

    const status = tableReservations?.length
      ? tableReservations.some((res) => res.status === "confirmed")
        ? "reserved"
        : "pending"
      : "available";

    return {
      ...table,
      status,
      reservations: tableReservations || [],
    };
  });

  return tablesWithStatus;
}
