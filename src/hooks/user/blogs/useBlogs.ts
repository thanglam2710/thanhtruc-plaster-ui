import { useApiQuery } from "@/hooks/base/useApi";
import { USER_API_ENDPOINTS } from "@/constants/api/user";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import type {
    BlogSearchRequest,
    BlogSearchResponse,
    BlogDTO,
} from "@/types/user/blogs";
import type { BlogTypeDTO } from "@/types/user/blog-types";

// Search blogs with filters (default isPublished=true)
export const useSearchBlogs = (request?: BlogSearchRequest | null) => {
    // Always set isPublished to true for user-facing pages
    const searchParams = {
        ...request,
        isPublished: true,
    };

    return useApiQuery<BlogSearchResponse>(
        CacheKeys.UserBlogs,
        USER_API_ENDPOINTS.BLOGS.SEARCH,
        {
            params: objectToQueryParams(searchParams),
        }
    );
};

// Get blog by slug
export const useGetBlogBySlug = (slug: string) => {
    return useApiQuery<BlogDTO>(
        `${CacheKeys.UserBlogDetail}:${slug}`,
        USER_API_ENDPOINTS.BLOGS.GET_BY_SLUG.replace("{slug}", slug),
        { skip: !slug }
    );
};

// Get all blog types
export const useGetAllBlogTypes = () => {
    return useApiQuery<BlogTypeDTO[]>(
        CacheKeys.UserBlogTypes,
        USER_API_ENDPOINTS.BLOG_TYPES.GET_ALL
    );
};
