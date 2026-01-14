import { USER_API_ENDPOINTS } from "@/constants/api/user";
import { useApiQuery } from "../base/useApi";
import { CacheKeys } from "../base/cacheKey";
import { ProjectDTO } from "@/types/dashboard/projects";
import { BlogDTO } from "@/types/dashboard/blogs";
import { PaginationResponse } from "@/types/dashboard/search-params";
import { objectToQueryParams } from "@/lib/utils";

// Lấy danh sách dự án (Public)
export const useGetPublicProjects = (request?: any) => {
  return useApiQuery<PaginationResponse<ProjectDTO>>(
    CacheKeys.Projects,
    USER_API_ENDPOINTS.PROJECTS.SEARCH,
    { params: objectToQueryParams(request || {}) }
  );
};

// Lấy chi tiết dự án theo Slug
export const useGetProjectBySlug = (slug: string) => {
  return useApiQuery<ProjectDTO>(
    CacheKeys.Projects,
    USER_API_ENDPOINTS.PROJECTS.GET_BY_SLUG.replace("{slug}", slug),
    { skip: !slug }
  );
};

// Lấy bài viết (Public)
export const useGetPublicBlogs = (request?: any) => {
  return useApiQuery<PaginationResponse<BlogDTO>>(
    CacheKeys.Blogs,
    USER_API_ENDPOINTS.BLOGS.SEARCH,
    { params: objectToQueryParams(request || {}) }
  );
};

// Lấy bài viết theo Slug
export const useGetBlogBySlug = (slug: string) => {
  return useApiQuery<BlogDTO>(
    CacheKeys.Blogs,
    USER_API_ENDPOINTS.BLOGS.GET_BY_SLUG.replace("{slug}", slug),
    { skip: !slug }
  );
};