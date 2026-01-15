// Dashboard Statistics Hooks
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API_ENDPOINTS } from "@/constants/api/dashboard/main";
import type {
    DashboardCounters,
    TopViewBlog,
    LatestContact,
} from "@/types/dashboard/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const useGetDashboardCounters = () => {
    return useQuery<{ resultObj: DashboardCounters }>({
        queryKey: ["dashboard-counters"],
        queryFn: async () => {
            const response = await fetch(
                `${API_URL}${DASHBOARD_API_ENDPOINTS.DASHBOARD.GET_COUNTERS}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch dashboard counters");
            }
            return response.json();
        },
    });
};

export const useGetTopViewBlogs = () => {
    return useQuery<{ resultObj: TopViewBlog[] }>({
        queryKey: ["top-view-blogs"],
        queryFn: async () => {
            const response = await fetch(
                `${API_URL}${DASHBOARD_API_ENDPOINTS.DASHBOARD.TOP_VIEW_BLOGS}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch top view blogs");
            }
            return response.json();
        },
    });
};

export const useGetLatestContacts = () => {
    return useQuery<{ resultObj: LatestContact[] }>({
        queryKey: ["latest-contacts"],
        queryFn: async () => {
            const response = await fetch(
                `${API_URL}${DASHBOARD_API_ENDPOINTS.DASHBOARD.LATEST_CONTACTS}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch latest contacts");
            }
            return response.json();
        },
    });
};
