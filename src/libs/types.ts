export interface TableData {
  id: number;
  created_at: string;
  table_name: string;
  seats: number;
  status: "available" | "pending" | "reserved";
  selectedDate?: Date;
}

export interface ReservationFormProps {
  tableId: number;
  reservationDate: Date;
  table: TableData | null;
}

export interface ReservationFormData {
  id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  guest_count: number;
  time_slot: string;
  optional_message: string;
  reservation_date: string;
  status: string;
  table_number?: string;
  table_id?: number;
  tables?: {
    id: number;
    table_name: string;
    seats: number;
    status: string;
  };
}
