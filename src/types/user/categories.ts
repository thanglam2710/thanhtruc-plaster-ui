// Categories types for user-facing pages
export interface CategorySearchRequest {
    parentId?: number;
    isActive?: boolean;
    searchValue?: string;
    sortBy?: string;
    isDescending?: boolean;
    isGetMaximum?: boolean;
    pageIndex?: number;
    pageSize?: number;
    fromDate?: string;
    toDate?: string;
}

export interface CategoryDTO {
    id: number;
    name: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    parentId?: number;
    parentName?: string;
    isActive: boolean;
    sortOrder?: number;
    createdTime: string;
    updatedTime?: string;
}

export interface CategorySearchResponse {
    items: CategoryDTO[];
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}
