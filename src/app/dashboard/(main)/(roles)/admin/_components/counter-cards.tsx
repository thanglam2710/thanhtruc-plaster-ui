"use client";

import { useGetDashboardCounters } from "@/hooks/dashboard/dashboard/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, MessageSquare, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CounterCards() {
  const { data, isLoading, error } = useGetDashboardCounters();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data?.resultObj) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không thể tải dữ liệu thống kê
      </div>
    );
  }

  const counters = data.resultObj;

  const cards = [
    {
      title: "Dự án đã làm",
      value: counters.totalProjects,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Bài viết tin tức",
      value: counters.totalBlogs,
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Lượt truy cập",
      value: counters.totalViews,
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Liên hệ",
      value: counters.totalContacts,
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
