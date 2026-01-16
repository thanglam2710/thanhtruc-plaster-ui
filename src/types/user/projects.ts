// Projects types for user-facing pages
export interface ProjectSearchRequest {
    categoryId?: number;
    isActive?: boolean;
    searchValue?: string;
    sortBy?: string;
    isDescending?: boolean;
    pageIndex?: number;
    pageSize?: number;
    fromDate?: string;
    toDate?: string;
}

export interface ProjectDTO {
    id: number;
    name: string;
    slug: string;
    description: string;
    content: string;
    thumbnail: string;
    gallery?: string[]; // Array of image URLs
    location?: string;
    completedAt?: string; // ISO DateTime string from backend
    categoryId: number;
    categoryName?: string;
    isActive: boolean;
    sortOrder?: number;
    createdTime: string;
    updatedTime?: string;
}

export interface ProjectSearchResponse {
    items: ProjectDTO[];
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}
