// Blogs types for user-facing pages
export interface BlogSearchRequest {
    blogTypeId?: number;
    isPublished?: boolean;
    authorId?: string;
    searchValue?: string;
    sortBy?: string;
    isDescending?: boolean;
    isGetMaximum?: boolean;
    pageIndex?: number;
    pageSize?: number;
    fromDate?: string;
    toDate?: string;
}

export interface BlogDTO {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    thumbnail: string;
    blogTypeId: number;
    blogTypeName?: string;
    authorId: string;
    authorName?: string;
    isPublished: boolean;
    publishedDate?: string;
    viewCount?: number;
    sortOrder?: number;
    createdTime: string;
    updatedTime?: string;
}

export interface BlogSearchResponse {
    items: BlogDTO[];
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}
