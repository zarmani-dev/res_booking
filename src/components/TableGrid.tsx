"use client";

import { useEffect, useState } from "react";
import { Table } from "./Table";
import { getTableStatusForDate } from "@/app/actions/tableAvailability";
import { DatePicker } from "./DatePicker";
import { format } from "date-fns";
import { TableData } from "@/libs/types";

export function TableGrid() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tables, setTables] = useState<TableData[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      const tablesData = await getTableStatusForDate(selectedDate);
      if (tablesData) {
        setTables(tablesData);
      }
    };

    fetchTables();
  }, [selectedDate]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 border border-gray-800 dark:border-gray-300 rounded flex items-center">
        <DatePicker
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date || new Date())}
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4">
        Tables for {format(selectedDate, "MMMM d, yyyy")}
      </h2>
      <div className="grid grid-cols-3 gap-8 mb-8">
        {tables.map((table) => (
          <Table key={table.id} {...table} selectedDate={selectedDate} />
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
