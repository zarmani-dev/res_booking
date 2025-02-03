import { createClient } from "@/utils/supabase/client";

export async function getAllTables() {
  const supabase = createClient();
  const { data, error } = await supabase.from("tables").select("*");
  if (error) {
    console.error("Error fetching table availability:", error);
    throw error;
  }
  return { data };
}

export async function getTableById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching table:", error);
    throw error;
  }
  return { data };
}
