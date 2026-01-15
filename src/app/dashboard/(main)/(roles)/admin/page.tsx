"use client";

import { CounterCards } from "./_components/counter-cards";
import { TopBlogsChart } from "./_components/top-blogs-chart";
import { LatestContactsTable } from "./_components/latest-contacts-table";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">
          Thống kê và hoạt động gần đây của hệ thống
        </p>
      </div>

      {/* Counter Cards */}
      <CounterCards />

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopBlogsChart />
        <div className="md:col-span-2">
          <LatestContactsTable />
        </div>
      </div>
    </div>
  );
}
