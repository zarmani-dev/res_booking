"use server";

import { createClient } from "@/utils/supabase/client";
import { ReservationForm } from "@/components/ReservationForm";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { date: string };
}) {
  const supabase = createClient();
  const { data: table } = await supabase
    .from("tables")
    .select("*")
    .eq("id", params.id)
    .single();

  const selectedDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-5">
        Table Name: {table?.table_name}
      </h1>
      <ReservationForm
        tableId={parseInt(params.id)}
        table={table}
        reservationDate={selectedDate}
      />
    </div>
  );
}
