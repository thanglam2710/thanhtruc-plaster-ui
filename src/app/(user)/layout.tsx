// src/app/(user)/layout.tsx
import { QueryProvider } from "@/lib/providers/query-provider";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
