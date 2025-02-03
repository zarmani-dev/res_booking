import { TableData } from "@/libs/types";
import Link from "next/link";
import { format } from "date-fns";

interface TableProps extends TableData {
  selectedDate: Date;
}

export function Table({
  id,
  table_name,
  seats,
  status,
  selectedDate,
}: TableProps) {
  const statusColor = {
    available: "bg-green-500",
    pending: "bg-yellow-500",
    reserved: "bg-red-500",
  };

  const TableContent = () => {
    return (
      <div className={`p-4 rounded-lg border ${statusColor[status]} `}>
        <h3 className="font-bold">{table_name}</h3>
        <p>Seats: {seats}</p>
        <p className="capitalize">Status: {status}</p>
      </div>
    );
  };

  if (status === "available") {
    return (
      <Link href={`/tables/${id}?date=${format(selectedDate, "yyyy-MM-dd")}`}>
        <TableContent />
      </Link>
    );
  }

  return (
    <div className="cursor-not-allowed">
      <TableContent />
    </div>
  );
}
