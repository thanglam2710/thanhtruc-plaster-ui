import { useApiQuery } from "@/hooks/base/useApi";
import { USER_API_ENDPOINTS } from "@/constants/api/user";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import type {
    CategorySearchRequest,
    CategorySearchResponse,
    CategoryDTO,
} from "@/types/user/categories";

// Search categories with filters (for parentId filtering)
export const useSearchCategories = (request?: CategorySearchRequest | null) => {
    return useApiQuery<CategorySearchResponse>(
        CacheKeys.UserCategories,
        USER_API_ENDPOINTS.CATEGORIES.SEARCH,
        {
            params: objectToQueryParams(request || {}),
        }
    );
};

// Get all categories (used for navbar)
export const useGetAllCategories = () => {
    return useApiQuery<CategoryDTO[]>(
        CacheKeys.UserCategoriesAll,
        USER_API_ENDPOINTS.CATEGORIES.GET_ALL
    );
};
