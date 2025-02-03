"use server";

import { createClient } from "@/utils/supabase/server";
import { ReservationFormData } from "@/libs/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function createReservation(
  tableId: number,
  reservationDate: Date,
  formData: ReservationFormData
) {
  const supabase = await createClient();

  const reservation = {
    table_id: tableId,
    reservation_date: reservationDate.toISOString().split("T")[0],
    time_slot: formData.time_slot,
    guest_count: formData.guest_count,
    optional_message: formData.optional_message,
    status: "pending",
    customer_name: formData.customer_name,
    customer_phone: formData.customer_phone,
    customer_email: formData.customer_email,
  };

  // Update table status to pending
  const { error: tableError } = await supabase
    .from("tables")
    .update({ status: "pending" })
    .eq("id", tableId);

  if (tableError) {
    throw new Error("Failed to update table status");
  }

  // Create the reservation
  const { error } = await supabase.from("reservations").insert(reservation);

  if (error) {
    throw new Error("Failed to create reservation");
  }

  revalidatePath("/");
  redirect("/");
  return { success: true };
}
