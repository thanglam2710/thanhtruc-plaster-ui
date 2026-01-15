// src/app/(user)/layout.tsx
import { QueryProvider } from "@/lib/providers/query-provider";
import { Navbar } from "@/components/user/layout/navbar";
import { Footer } from "@/components/user/layout/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </QueryProvider>
  );
}
