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
  
  // Core Entities
  Projects: `${CachePrefix}:Projects`,
  Blogs: `${CachePrefix}:Blogs`,
  BlogTypes: `${CachePrefix}:BlogTypes`,
  Categories: `${CachePrefix}:Categories`,
  Contacts: `${CachePrefix}:Contacts`,
  
  // Stats
  DashboardStats: `${CachePrefix}:DashboardStats`,
} as const;