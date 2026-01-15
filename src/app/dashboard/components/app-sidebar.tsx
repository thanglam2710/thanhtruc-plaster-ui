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

// Mock user data (Thay bằng dữ liệu thật từ AuthProvider sau này)
const mockUser = {
  id: 1,
  fullName: "Admin Thanh Trúc",
  email: "admin@thanhtruc.vn",
  avatarUrl: null,
  roleName: "Admin",
};

const navItems = [
  {
    title: "Tổng quan (Dashboard)",
    url: "/dashboard/admin",
    icon: PieChart,
    isActive: true,
  },
  {
    title: "Liên hệ (Contacts)",
    url: "/dashboard/admin/feedbacks", // Assuming feedbacks = contacts based on previous context
    icon: MessageSquare,
  },
  {
    title: "Danh mục & Dự án",
    url: "#",
    icon: Briefcase,
    items: [
      { title: "Danh mục (Categories)", url: "/dashboard/categories" },
      { title: "Dự án (Projects)", url: "/dashboard/admin/projects" },
    ],
  },
  {
    title: "Tin tức & Bài viết",
    url: "#",
    icon: FileText,
    items: [
      { title: "Danh sách bài viết", url: "/dashboard/admin/blogs" },
      { title: "Loại bài viết", url: "/dashboard/blog-types" },
    ],
  },
  {
    title: "Nhân viên (Staffs)",
    url: "/dashboard/admin/staffs",
    icon: User,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { staff } = useAuth(); // Dùng hook thật sau này
  const staff = mockUser; // Dùng mock để test UI trước

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
        {/* @ts-ignore */}
        <NavUser user={staff} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
