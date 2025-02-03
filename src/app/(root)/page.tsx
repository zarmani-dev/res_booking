"use client";

import { TableGrid } from "@/components/TableGrid";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Restaurant Floor Plan
      </h1>
      <p className="text-center mb-8 text-muted-foreground">
        Select a date to view table arrangements and status
      </p>
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
        }
      `}</style>
      <TableGrid />
    </main>
  );
}
