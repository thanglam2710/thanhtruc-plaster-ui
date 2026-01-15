"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { getStaff } from "@/lib/providers/auth-provider";
import { useEffect, useState } from "react";
import { LoginResponse } from "@/types/dashboard/auth-model";

export function DashboardHeader() {
  const [staff, setStaff] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const staffData = getStaff();
    setStaff(staffData);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 text-brand-primary" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-primary">
          Xin chào, <span className="text-brand-secondary">{staff?.fullName || "Admin"}</span>
        </h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
