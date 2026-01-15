"use client";

import * as React from "react";
import {
  PieChart,
  Settings,
  User,
  Box,
  FileText,
  Briefcase,
  Layers,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { getStaff } from "@/lib/providers/auth-provider";
import { useGetStaffById } from "@/hooks/dashboard/staffs/useStaffs";
import { useEffect, useState } from "react";
import { LoginResponse } from "@/types/dashboard/auth-model";



const navItems = [
  {
    title: "Tổng quan hệ thống",
    url: "/dashboard/admin",
    icon: PieChart,
    items: [
      { title: "Bảng điều khiển", url: "/dashboard/admin" },
    ],
  },
  {
    title: "Chăm sóc khách hàng",
    url: "#",
    icon: MessageSquare,
    items: [
      { title: "Liên hệ", url: "/dashboard/contacts" },
    ],
  },
  {
    title: "Danh mục & Dự án",
    url: "#",
    icon: Briefcase,
    items: [
      { title: "Danh mục", url: "/dashboard/categories" },
      { title: "Dự án", url: "/dashboard/projects" },
    ],
  },
  {
    title: "Tin tức & Bài viết",
    url: "#",
    icon: FileText,
    items: [
      { title: "Bài viết", url: "/dashboard/blogs" },
      { title: "Loại bài viết", url: "/dashboard/blog-types" },
    ],
  },
  {
    title: "Quản trị nhân sự",
    url: "#",
    icon: User,
    items: [
      { title: "Nhân viên (Staffs)", url: "/dashboard/staffs" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, setCurrentUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    setCurrentUser(getStaff());
  }, []);

  // Fetch full details if we have an ID
  const { data: staffData } = useGetStaffById(currentUser?.id || "");

  // Prioritize real-time data from API, fallback to localStorage data
  const displayUser = staffData ? {
      fullName: staffData.fullName,
      email: staffData.email,
      avatarUrl: staffData.avatarUrl
  } : currentUser ? {
      fullName: currentUser.fullName,
      email: currentUser.email,
      avatarUrl: currentUser.avatarUrl
  } : {
      fullName: "Đang tải...",
      email: "",
      avatarUrl: null
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-brand-secondary/20"
    >
      <SidebarHeader className="bg-[#1A1A1A] text-white border-b border-white/10 h-16 flex items-center justify-center">
        {/* Logo thu gọn/đầy đủ sẽ xử lý bởi Sidebar logic, ở đây để text đơn giản */}
        <Link
          href="/dashboard/admin"
          className="font-bold uppercase tracking-widest text-brand-secondary group-data-[collapsible=icon]:hidden"
        >
          Thanh Trúc Plaster
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#1A1A1A] text-white custom-scrollbar">
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter className="bg-[#1A1A1A] text-white border-t border-white/10">
        <NavUser user={displayUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
