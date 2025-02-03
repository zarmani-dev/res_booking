"use client";

import { useEffect, useState } from "react";
import { Table } from "./Table";
import { createClient } from "@/utils/supabase/client";
import { TableData } from "@/libs/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

// Initialize the Supabase client
const supabase = createClient();

export function TableGrid() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchTables() {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("id");

      if (error) {
        console.error("Error fetching tables:", error);
      } else {
        setTables(data);
      }
    }

    fetchTables();
  }, [selectedDate]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date || new Date())}
          dateFormat="MMMM d, yyyy"
          className="p-2 border rounded bg-gray-800"
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4">
        Tables for {format(selectedDate, "MMMM d, yyyy")}
      </h2>
      <div className="grid grid-cols-3 gap-8 mb-8">
        {tables.map((table) => (
          <Table key={table.id} {...table} />
        ))}
      </div>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}
