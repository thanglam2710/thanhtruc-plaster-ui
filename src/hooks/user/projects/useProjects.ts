import { useApiQuery } from "@/hooks/base/useApi";
import { USER_API_ENDPOINTS } from "@/constants/api/user";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import type {
    ProjectSearchRequest,
    ProjectSearchResponse,
    ProjectDTO,
} from "@/types/user/projects";

// Search projects with filters
export const useSearchProjects = (request?: ProjectSearchRequest | null) => {
    return useApiQuery<ProjectSearchResponse>(
        CacheKeys.UserProjects,
        USER_API_ENDPOINTS.PROJECTS.SEARCH,
        {
            params: objectToQueryParams(request || {}),
        }
    );
};

// Get project by slug
export const useGetProjectBySlug = (slug: string) => {
    return useApiQuery<ProjectDTO>(
        `${CacheKeys.UserProjectDetail}:${slug}`,
        USER_API_ENDPOINTS.PROJECTS.GET_BY_SLUG.replace("{slug}", slug),
        { skip: !slug }
    );
};
