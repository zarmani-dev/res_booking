import { TableData } from "@/libs/types";
import Link from "next/link";

export function Table({ table_name, seats, status, id }: TableData) {
  const statusColors = {
    available: "bg-green-500",
    pending: "bg-yellow-500",
    reserved: "bg-red-500",
  };

  return (
    <Link
      href={`/tables/${id}`}
      className={`w-20 h-20 ${statusColors[status]} rounded-full flex items-center justify-center relative`}
    >
      <div className="text-white text-center">
        <div className="font-bold text-sm">{table_name}</div>
        <div className="text-xs">{seats} seats</div>
      </div>
    </Link>
  );
}
