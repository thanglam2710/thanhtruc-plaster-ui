import { useState, useEffect } from 'react';

const STORAGE_KEY = 'contact_submissions';
const MAX_SUBMISSIONS = 5;
const RESET_PERIOD_HOURS = 24;

interface SubmissionRecord {
    count: number;
    lastReset: string;
    submissions: string[];
}

interface RateLimitStatus {
    allowed: boolean;
    remaining: number;
    resetTime: Date | null;
    isLimited: boolean;
}

export const useContactRateLimit = () => {
    const [status, setStatus] = useState<RateLimitStatus>({
        allowed: true,
        remaining: MAX_SUBMISSIONS,
        resetTime: null,
        isLimited: false,
    });

    // Check and update rate limit status
    const checkRateLimit = (): RateLimitStatus => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const now = new Date();

            if (!stored) {
                // First time user
                return {
                    allowed: true,
                    remaining: MAX_SUBMISSIONS,
                    resetTime: null,
                    isLimited: false,
                };
            }

            const record: SubmissionRecord = JSON.parse(stored);
            const lastReset = new Date(record.lastReset);
            const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

            // Reset if 24 hours have passed
            if (hoursSinceReset >= RESET_PERIOD_HOURS) {
                localStorage.removeItem(STORAGE_KEY);
                return {
                    allowed: true,
                    remaining: MAX_SUBMISSIONS,
                    resetTime: null,
                    isLimited: false,
                };
            }

            // Filter submissions within the last 24 hours
            const recentSubmissions = record.submissions.filter((timestamp) => {
                const submissionTime = new Date(timestamp);
                const hoursSince = (now.getTime() - submissionTime.getTime()) / (1000 * 60 * 60);
                return hoursSince < RESET_PERIOD_HOURS;
            });

            const remaining = MAX_SUBMISSIONS - recentSubmissions.length;
            const allowed = remaining > 0;

            // Calculate reset time (24 hours from the oldest submission)
            let resetTime: Date | null = null;
            if (recentSubmissions.length > 0) {
                const oldestSubmission = new Date(recentSubmissions[0]);
                resetTime = new Date(oldestSubmission.getTime() + RESET_PERIOD_HOURS * 60 * 60 * 1000);
            }

            return {
                allowed,
                remaining: Math.max(0, remaining),
                resetTime,
                isLimited: !allowed,
            };
        } catch (error) {
            console.error('Error checking rate limit:', error);
            // If localStorage fails, allow the submission (fail open)
            return {
                allowed: true,
                remaining: MAX_SUBMISSIONS,
                resetTime: null,
                isLimited: false,
            };
        }
    };

    // Record a new submission
    const recordSubmission = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const now = new Date();

            if (!stored) {
                // First submission
                const record: SubmissionRecord = {
                    count: 1,
                    lastReset: now.toISOString(),
                    submissions: [now.toISOString()],
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
            } else {
                const record: SubmissionRecord = JSON.parse(stored);

                // Filter recent submissions
                const recentSubmissions = record.submissions.filter((timestamp) => {
                    const submissionTime = new Date(timestamp);
                    const hoursSince = (now.getTime() - submissionTime.getTime()) / (1000 * 60 * 60);
                    return hoursSince < RESET_PERIOD_HOURS;
                });

                // Add new submission
                recentSubmissions.push(now.toISOString());

                const updatedRecord: SubmissionRecord = {
                    count: recentSubmissions.length,
                    lastReset: record.lastReset,
                    submissions: recentSubmissions,
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecord));
            }

            // Update status after recording
            setStatus(checkRateLimit());
        } catch (error) {
            console.error('Error recording submission:', error);
        }
    };

    // Get remaining submissions
    const getRemainingSubmissions = (): number => {
        return status.remaining;
    };

    // Format reset time for display
    const getResetTimeFormatted = (): string | null => {
        if (!status.resetTime) return null;

        const now = new Date();
        const diff = status.resetTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours} giờ ${minutes} phút`;
        }
        return `${minutes} phút`;
    };

    // Initialize on mount
    useEffect(() => {
        setStatus(checkRateLimit());
    }, []);

    return {
        ...status,
        recordSubmission,
        getRemainingSubmissions,
        getResetTimeFormatted,
        checkRateLimit,
    };
};
