export const DASHBOARD_ROUTES = {
  // 1. Quản lý Dự án (Thay cho Foods)
  PROJECTS: {
    LIST: "/dashboard/projects",
    CREATE: "/dashboard/projects/create",
    DETAIL: "/dashboard/projects/:id",
  },

  // 2. Quản lý Danh mục (Thay cho Groups/FoodTypes)
  CATEGORIES: {
    LIST: "/dashboard/categories",
    CREATE: "/dashboard/categories/create",
    DETAIL: "/dashboard/categories/:id",
  },

  // 3. Quản lý Bài viết (Thay cho Menus)
  BLOGS: {
    LIST: "/dashboard/blogs",
    CREATE: "/dashboard/blogs/create",
    DETAIL: "/dashboard/blogs/:id",
  },

  // 4. Quản lý Loại bài viết
  BLOG_TYPES: {
    LIST: "/dashboard/blog-types",
    CREATE: "/dashboard/blog-types/create",
    DETAIL: "/dashboard/blog-types/:id",
  },

  // 5. Quản lý Liên hệ
  CONTACTS: {
    LIST: "/dashboard/contacts",
    DETAIL: "/dashboard/contacts/:id",
  },

  // 6. Thống kê
  STATS: {
    MAIN: "/dashboard", // Trang chủ dashboard
  }
};