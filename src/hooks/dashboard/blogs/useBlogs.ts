import { DASHBOARD_API_ENDPOINTS } from "@/constants/api/dashboard/main";
import { useApiDeleteMutation, useApiMutation, useApiPutMutation, useApiQuery } from "@/hooks/base/useApi";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import { BlogDTO, BlogTypeDTO, CreateBlogRequest, CreateBlogTypeRequest, SearchBlogRequest, UpdateBlogRequest, UpdateBlogTypeRequest } from "@/types/dashboard/blogs";
import { PaginationResponse, SearchPaginationRequest } from "@/types/dashboard/search-params";

// --- BLOG HOOKS ---
export const useGetBlogsPagination = (request?: SearchBlogRequest | null, options?: { skip?: boolean }) => {
  return useApiQuery<PaginationResponse<BlogDTO>>(
    CacheKeys.Blogs,
    DASHBOARD_API_ENDPOINTS.BLOGS.SEARCH,
    {
      params: objectToQueryParams(request || {}),
      skip: options?.skip,
      ...options,
    }
  );
};

export const useGetBlogById = (id: number) => {
  return useApiQuery<BlogDTO>(
    CacheKeys.Blogs,
    DASHBOARD_API_ENDPOINTS.BLOGS.GET_BY_ID.replace("{id}", id.toString()),
    { skip: !id }
  );
};

export const useCreateBlogMutation = () => {
  return useApiMutation<BlogDTO, CreateBlogRequest>(
    DASHBOARD_API_ENDPOINTS.BLOGS.CREATE, true, { invalidateQueries: [CacheKeys.Blogs] }
  );
};

export const useUpdateBlogMutation = () => {
  return useApiPutMutation<BlogDTO, UpdateBlogRequest>(
    DASHBOARD_API_ENDPOINTS.BLOGS.UPDATE, { invalidateQueries: [CacheKeys.Blogs] }, true
  );
};

export const useDeleteBlogMutation = () => {
  return useApiDeleteMutation<any, number>(
    (id) => DASHBOARD_API_ENDPOINTS.BLOGS.DELETE.replace("{id}", id.toString()),
    { invalidateQueries: [CacheKeys.Blogs] }
  );
};

// --- BLOG TYPE HOOKS ---
export const useGetAllBlogTypes = () => {
  return useApiQuery<BlogTypeDTO[]>(
    CacheKeys.BlogTypes,
    DASHBOARD_API_ENDPOINTS.BLOG_TYPES.GET_ALL
  );
};

export const useGetBlogTypesPagination = (request?: SearchPaginationRequest | null, options?: { skip?: boolean }) => {
  return useApiQuery<PaginationResponse<BlogTypeDTO>>(
    CacheKeys.BlogTypes,
    DASHBOARD_API_ENDPOINTS.BLOG_TYPES.SEARCH,
    {
      params: objectToQueryParams(request || {}),
      skip: options?.skip,
      ...options,
    }
  );
};

export const useGetBlogTypeById = (id: number) => {
  return useApiQuery<BlogTypeDTO>(
    CacheKeys.BlogTypes,
    DASHBOARD_API_ENDPOINTS.BLOG_TYPES.GET_BY_ID.replace("{id}", id.toString()),
    { skip: !id }
  );
};

export const useCreateBlogTypeMutation = () => {
  return useApiMutation<BlogTypeDTO, CreateBlogTypeRequest>(
    DASHBOARD_API_ENDPOINTS.BLOG_TYPES.CREATE, false, { invalidateQueries: [CacheKeys.BlogTypes] }
  );
};

export const useUpdateBlogTypeMutation = () => {
  return useApiPutMutation<BlogTypeDTO, UpdateBlogTypeRequest>(
    DASHBOARD_API_ENDPOINTS.BLOG_TYPES.UPDATE, { invalidateQueries: [CacheKeys.BlogTypes] }, false
  );
};

export const useDeleteBlogTypeMutation = () => {
  return useApiDeleteMutation<any, number>(
    (id) => DASHBOARD_API_ENDPOINTS.BLOG_TYPES.DELETE.replace("{id}", id.toString()),
    { invalidateQueries: [CacheKeys.BlogTypes] }
  );
};
