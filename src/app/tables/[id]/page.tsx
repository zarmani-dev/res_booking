import { createClient } from "@/utils/supabase/server";
import { ReservationForm } from "@/components/ReservationForm";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: table } = await supabase
    .from("tables")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Table Name: {table?.table_name}</h1>
      <ReservationForm
        tableId={parseInt(id)}
        table={table}
        reservationDate={new Date()}
      />
    </div>
  );
}
