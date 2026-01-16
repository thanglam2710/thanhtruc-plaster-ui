// Helper function to validate image URL - prevents "Invalid URL" errors
export const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url || typeof url !== "string" || url.trim() === "") {
        return "/images/placeholder.jpg";
    }

    // Check if it's a valid URL format
    try {
        // If it starts with http/https, validate it
        if (url.startsWith("http://") || url.startsWith("https://")) {
            new URL(url);
            return url;
        }
        // If it's a relative path, return as is
        if (url.startsWith("/")) {
            return url;
        }
        // Otherwise, return placeholder
        return "/images/placeholder.jpg";
    } catch {
        return "/images/placeholder.jpg";
    }
};
