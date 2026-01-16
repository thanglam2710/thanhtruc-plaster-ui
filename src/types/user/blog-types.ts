// Blog Types types for user-facing pages
export interface BlogTypeDTO {
    id: number;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    sortOrder?: number;
    createdTime: string;
    updatedTime?: string;
}
