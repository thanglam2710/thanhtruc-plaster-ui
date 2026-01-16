export const CacheTime = {
  OneMinute: 60 * 1000,
  FiveMinutes: 5 * 60 * 1000,
  TenMinutes: 10 * 60 * 1000,
  OneHour: 60 * 60 * 1000,
  OneDay: 24 * 60 * 60 * 1000,
};

const CachePrefix = "Api";

export const CacheKeys = {
  // Auth & Staff
  Staffs: `${CachePrefix}:Staffs`,
  Profile: `${CachePrefix}:Profile`,

  // Core Entities (Dashboard)
  Projects: `${CachePrefix}:Projects`,
  Blogs: `${CachePrefix}:Blogs`,
  BlogTypes: `${CachePrefix}:BlogTypes`,
  Categories: `${CachePrefix}:Categories`,
  Contacts: `${CachePrefix}:Contacts`,

  // User-facing queries (separate cache)
  UserProjects: `${CachePrefix}:User:Projects`,
  UserProjectDetail: `${CachePrefix}:User:Project:Detail`,
  UserBlogs: `${CachePrefix}:User:Blogs`,
  UserBlogDetail: `${CachePrefix}:User:Blog:Detail`,
  UserCategories: `${CachePrefix}:User:Categories`,
  UserCategoriesAll: `${CachePrefix}:User:Categories:All`,
  UserBlogTypes: `${CachePrefix}:User:BlogTypes`,

  // Stats
  DashboardStats: `${CachePrefix}:DashboardStats`,
} as const;