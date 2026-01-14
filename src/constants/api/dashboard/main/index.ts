export const DASHBOARD_API_ENDPOINTS = {
  // 1. Quản lý Dự án
  PROJECTS: {
    SEARCH: "/Projects/search",
    GET_BY_ID: "/Projects/{id}",
    DELETE: "/Projects/{id}",
    CREATE: "/Projects/create",
    UPDATE: "/Projects/update",
  },

  // 2. Quản lý Bài viết
  BLOGS: {
    SEARCH: "/Blogs/search",
    GET_BY_ID: "/Blogs/{id}",
    DELETE: "/Blogs/{id}",
    CREATE: "/Blogs/create",
    UPDATE: "/Blogs/update",
  },

  // 3. Quản lý Loại bài viết
  BLOG_TYPES: {
    GET_ALL: "/BlogTypes/get-all",
    GET_BY_ID: "/BlogTypes/{id}",
    DELETE: "/BlogTypes/{id}",
    SEARCH: "/BlogTypes/search",
    CREATE: "/BlogTypes/create",
    UPDATE: "/BlogTypes/update",
  },

  // 4. Quản lý Danh mục
  CATEGORIES: {
    GET_ALL: "/Categories/get-all",
    SEARCH: "/Categories/search",
    GET_BY_ID: "/Categories/{id}",
    DELETE: "/Categories/{id}",
    CREATE: "/Categories/create",
    UPDATE: "/Categories/update",
  },

  // 5. Quản lý Liên hệ
  CONTACTS: {
    SEARCH: "/Contacts/search",
    GET_STATUS: "/Contacts/get-contact-status",
    GET_TYPE: "/Contacts/get-contact-type",
    GET_BY_ID: "/Contacts/{id}",
    UPDATE_STATUS: "/Contacts/update-status",
  },

  // 6. Quản lý Media (Cloudinary)
  CLOUDINARY: {
    UPLOAD_MEDIA: "/Cloudinaries/upload-media",
    UPLOAD_IMAGE: "/Cloudinaries/upload-image",
    UPLOAD_VIDEO: "/Cloudinaries/upload-video",
    DELETE_MEDIA: "/Cloudinaries/delete-media/{publicId}",
  },

  // 7. Thống kê Dashboard
  DASHBOARD: {
    GET_COUNTERS: "/Dashboards/get-counters",
    TOP_VIEW_BLOGS: "/Dashboards/top-view-blogs",
    LATEST_CONTACTS: "/Dashboards/latest-contacts",
  },
};