import type { Metadata } from "next";
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import "nprogress/nprogress.css";
import { Toaster } from "sonner";

import { QueryProvider } from "@/lib/providers/query-provider";

// Font tiêu đề
const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  weight: ["600", "700"],
});

// Font nội dung
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Thanh Trúc - Thạch Cao & Nội Thất",
  description: "Giải pháp trần tường đẳng cấp chuyên gia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${montserrat.variable} ${beVietnam.variable} antialiased bg-bg-main text-[#6a4b3b]`}
      >
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
