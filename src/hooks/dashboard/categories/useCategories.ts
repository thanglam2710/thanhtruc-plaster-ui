import { DASHBOARD_API_ENDPOINTS } from "@/constants/api/dashboard/main";
import { useApiDeleteMutation, useApiMutation, useApiPutMutation, useApiQuery } from "@/hooks/base/useApi";
import { CacheKeys } from "@/hooks/base/cacheKey";
import { CategoryDTO, CreateCategoryRequest, SearchCategoryRequest, UpdateCategoryRequest } from "@/types/dashboard/categories";
import { PaginationResponse } from "@/types/dashboard/search-params";
import { objectToQueryParams } from "@/lib/utils";

export const useGetCategoriesPagination = (request?: SearchCategoryRequest | null, options?: { skip?: boolean }) => {
  return useApiQuery<PaginationResponse<CategoryDTO>>(
    CacheKeys.Categories,
    DASHBOARD_API_ENDPOINTS.CATEGORIES.SEARCH,
    {
      params: objectToQueryParams(request || {}),
      skip: options?.skip,
      ...options,
    }
  );
};

export const useGetAllCategories = () => {
  return useApiQuery<CategoryDTO[]>(
    CacheKeys.Categories,
    DASHBOARD_API_ENDPOINTS.CATEGORIES.GET_ALL
  );
};

export const useGetCategoryById = (id: number) => {
  return useApiQuery<CategoryDTO>(
    CacheKeys.Categories,
    DASHBOARD_API_ENDPOINTS.CATEGORIES.GET_BY_ID.replace("{id}", id.toString()),
    { skip: !id }
  );
};

export const useCreateCategoryMutation = () => {
  return useApiMutation<CategoryDTO, CreateCategoryRequest>(
    DASHBOARD_API_ENDPOINTS.CATEGORIES.CREATE, false, { invalidateQueries: [CacheKeys.Categories] }
  );
};

export const useUpdateCategoryMutation = () => {
  return useApiPutMutation<CategoryDTO, UpdateCategoryRequest>(
    DASHBOARD_API_ENDPOINTS.CATEGORIES.UPDATE, { invalidateQueries: [CacheKeys.Categories] }, false
  );
};

export const useDeleteCategoryMutation = () => {
  return useApiDeleteMutation<any, number>(
    (id) => DASHBOARD_API_ENDPOINTS.CATEGORIES.DELETE.replace("{id}", id.toString()),
    { invalidateQueries: [CacheKeys.Categories] }
  );
};