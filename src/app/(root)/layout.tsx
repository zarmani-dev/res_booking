import { Toaster } from "@/components/ui/toaster";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="p-5">
      {/* <h1 className="text-3xl underline my-3">Restaurant Booking System</h1> */}
      {children}
      <Toaster />
    </main>
  );
}
