export const USER_API_ENDPOINTS = {
  // 1. Gửi liên hệ (Form ở Footer/Contact Page)
  CONTACTS: {
    SUBMIT: "/Contacts/submit-contact",
  },

  // 2. Danh mục (Menu)
  CATEGORIES: {
    GET_ALL: "/Categories/get-all",
  },

  // 3. Dự án (Trang xem chi tiết dùng Slug)
  PROJECTS: {
    SEARCH: "/Projects/search",
    GET_BY_SLUG: "/Projects/slug/{slug}",
  },

  // 4. Bài viết (Tin tức)
  BLOGS: {
    SEARCH: "/Blogs/search",
    GET_BY_SLUG: "/Blogs/slug/{slug}",
  },
  
  // 5. Loại bài viết (Để filter)
  BLOG_TYPES: {
    GET_ALL: "/BlogTypes/get-all",
  },
};