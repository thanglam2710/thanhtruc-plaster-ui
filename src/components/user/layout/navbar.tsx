"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useGetAllBlogTypes } from "@/hooks/dashboard/blogs/useBlogs";
import { useGetAllCategories } from "@/hooks/dashboard/categories/useCategories";
import { USER_ROUTES } from "@/constants/routes/user/main";

// Menu tĩnh (chỉ giữ lại những mục không động)
const STATIC_MENU_START = [
  { label: "Trang chủ", link: USER_ROUTES.HOME }
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Fetch dữ liệu
  const { data: blogTypes } = useGetAllBlogTypes();
  const { data: allCategories } = useGetAllCategories();

  // 2. Xử lý dữ liệu Category (Tách Cha/Con và Sắp xếp)
  const rootCategories = useMemo(() => {
    if (!allCategories) return [];

    // Lọc ra category cha (parentId null hoặc <= 0)
    return allCategories
      .filter((c) => !c.parentId || c.parentId <= 0)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)); // Sắp xếp theo sortOrder bé -> lớn
  }, [allCategories]);

  // Hàm lấy con của một category cha
  const getChildCategories = (parentId: number) => {
    if (!allCategories) return [];
    return allCategories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-secondary">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <div className="flex flex-col cursor-pointer">
              <span className="text-2xl font-bold font-heading text-brand-primary tracking-tighter uppercase">
                THANH TRÚC
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary -mt-1">
                Thạch Cao & Nội Thất
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {/* 1. Menu Tĩnh (Trang chủ, Giới thiệu) */}
            {STATIC_MENU_START.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="text-sm font-semibold text-brand-primary hover:text-brand-secondary uppercase tracking-wide whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}

            {/* 2. Menu Động: Danh sách Category Cha */}
            {rootCategories.map((rootCat) => {
              const childCats = getChildCategories(rootCat.id);
              const hasChildren = childCats.length > 0;

              return (
                <div
                  key={rootCat.id}
                  className="relative group h-20 flex items-center"
                >
                  <Link
                    href={`/categories?parentId=${rootCat.id}`}
                    className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-secondary cursor-pointer uppercase tracking-wide whitespace-nowrap"
                  >
                    {rootCat.name}
                    {hasChildren && (
                      <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown Menu (Chỉ hiện nếu có con) */}
                  {hasChildren && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-brand-secondary py-2 hidden group-hover:block animate-fadeIn shadow-lg rounded-b-lg">
                      {/* Header nhỏ cho dropdown (tùy chọn) */}
                      <div className="px-6 py-2 mb-1 border-b border-gray-100">
                        <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">
                          Danh mục {rootCat.name}
                        </span>
                      </div>

                      {childCats.map((child) => (
                        <Link
                          key={child.id}
                          href={`/projects?categoryId=${child.id}&isActive=true`}
                          className="block px-6 py-3 text-sm font-medium text-brand-primary hover:bg-bg-main hover:text-brand-secondary transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 3. Menu Tin tức (Dynamic từ API) */}
            <div className="relative group h-20 flex items-center">
              <Link
                href={USER_ROUTES.BLOGS.LIST}
                className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-secondary uppercase tracking-wide whitespace-nowrap"
              >
                Tin tức{" "}
                <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 w-64 bg-white border border-brand-secondary py-2 hidden group-hover:block animate-fadeIn shadow-lg rounded-b-lg">
                {blogTypes?.map((type) => (
                  <Link
                    key={type.id}
                    href={`${USER_ROUTES.BLOGS.LIST}?blogTypeId=${type.id}&isPublished=true`}
                    className="block px-6 py-3 text-sm font-medium text-brand-primary hover:bg-bg-main hover:text-brand-secondary transition-colors"
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Nút Liên hệ */}
            <Link href={USER_ROUTES.CONTACT}>
              <button className="px-6 py-2 rounded-btn text-sm font-semibold uppercase tracking-wider bg-brand-primary text-brand-secondary hover:bg-[#5a3b2b] transition-colors whitespace-nowrap">
                Liên hệ
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-primary p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Cần update logic tương tự Desktop) */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-brand-secondary overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="px-4 pt-2 pb-12 space-y-1">
            {/* Static */}
            {STATIC_MENU_START.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="block py-4 text-sm font-bold text-brand-primary uppercase border-b border-gray-100"
              >
                {item.label}
              </Link>
            ))}

            {/* Dynamic Categories */}
             {rootCategories.map((root) => {
              const children = getChildCategories(root.id);
              return (
                <div key={root.id} className="border-b border-gray-100">
                  <Link
                    href={`/categories?parentId=${root.id}`}
                    className="block py-4 text-sm font-bold text-brand-primary uppercase"
                  >
                    {root.name}
                  </Link>
                  {children.length > 0 && (
                    <div className="pl-4 pb-4 bg-bg-main">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/projects?categoryId=${child.id}&isActive=true`}
                          className="block py-2 text-xs font-medium text-text-muted hover:text-brand-secondary"
                        >
                          - {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tin tức & Liên hệ... */}
            <Link
              href={USER_ROUTES.BLOGS.LIST}
              className="block py-4 text-sm font-bold text-brand-primary uppercase border-b border-gray-100"
            >
              Tin tức
            </Link>
            <div className="py-4">
              <Link href={USER_ROUTES.CONTACT}>
                <button className="w-full py-3 rounded-btn bg-brand-primary text-brand-secondary font-bold uppercase">
                  Liên hệ
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
