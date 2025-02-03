import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Admin Dashboard</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Manage reservations and table status
      </p>
      <AdminDashboard />
    </main>
  );
}
