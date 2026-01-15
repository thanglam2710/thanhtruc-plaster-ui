// Dashboard Statistics Types

export interface DashboardCounters {
    totalProjects: number;
    totalBlogs: number;
    totalContacts: number;
    totalViews: number;
}

export interface TopViewBlog {
    id: number;
    title: string;
    viewCount: number;
    imageUrl?: string;
    createdDate: string;
}

export interface LatestContact {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    status: string;
    createdDate: string;
}
