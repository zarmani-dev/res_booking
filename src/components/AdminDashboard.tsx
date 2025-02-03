"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { ReservationFormData } from "@/libs/types";

const supabase = createClient();

export function AdminDashboard() {
  const [reservations, setReservations] = useState<ReservationFormData[]>([]);
  const [date, setDate] = useState<Date>();
  const [sortBy, setSortBy] = useState<string>("reservation_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 10;

  const fetchReservations = async () => {
    let query = supabase
      .from("reservations")
      .select("*")
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(
        (currentPage - 1) * reservationsPerPage,
        currentPage * reservationsPerPage - 1
      );

    if (date) {
      query = query.eq("reservation_date", format(date, "yyyy-MM-dd"));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reservations:", error);
    } else {
      setReservations(data);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [date, sortBy, sortOrder, currentPage]);

  const handleConfirm = async (id: number) => {
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "confirmed" })
      .eq("id", id);

    if (!updateError) {
      const { data: reservation } = await supabase
        .from("reservations")
        .select("table_id")
        .eq("id", id)
        .single();

      if (reservation?.table_id) {
        await supabase
          .from("tables")
          .update({ status: "reserved" })
          .eq("id", reservation.table_id);
      }
    }

    if (updateError) {
      console.error("Error confirming reservation:", updateError);
    } else {
      fetchReservations();
    }
  };

  const handleCancel = async (id: number) => {
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (!updateError) {
      const { data: reservation } = await supabase
        .from("reservations")
        .select("table_id")
        .eq("id", id)
        .single();

      if (reservation?.table_id) {
        await supabase
          .from("tables")
          .update({ status: "available" })
          .eq("id", reservation.table_id);
      }
    }

    if (updateError) {
      console.error("Error cancelling reservation:", updateError);
    } else {
      fetchReservations();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex items-center space-x-2">
          <Select onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reservation_date">Date</SelectItem>
              <SelectItem value="time_slot">Time</SelectItem>
              <SelectItem value="customer_name">Customer Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.reservation_date}</TableCell>
              <TableCell>{reservation.time_slot}</TableCell>
              <TableCell>{reservation.customer_name}</TableCell>
              <TableCell>{reservation.customer_phone}</TableCell>
              <TableCell>{reservation.customer_email}</TableCell>
              <TableCell>{reservation.guest_count}</TableCell>
              <TableCell>{reservation.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      reservation.id && handleConfirm(reservation.id)
                    }
                    disabled={reservation.status === "confirmed"}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      reservation.id && handleCancel(reservation.id)
                    }
                    disabled={reservation.status === "cancelled"}
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={reservations.length < reservationsPerPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
