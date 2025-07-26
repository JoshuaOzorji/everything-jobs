import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { JobSubmissionItem } from "@/types/types";

interface JobSubmissionsResponse {
	submissions: JobSubmissionItem[];
	total: number;
}

// Fetch function
const fetchJobSubmissions = async (
	searchParams: URLSearchParams,
): Promise<JobSubmissionsResponse> => {
	const response = await fetch(
		`/api/view-jobs?${searchParams.toString()}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch job submissions");
	}

	return response.json();
};

export const useJobSubmissions = () => {
	const searchParams = useSearchParams();

	const queryResult = useQuery({
		queryKey: ["job-submissions", searchParams.toString()],
		queryFn: () => fetchJobSubmissions(searchParams),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: 2,
		retryDelay: (attemptIndex) =>
			Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	return {
		...queryResult,
		submissions: queryResult.data?.submissions || [],
		total: queryResult.data?.total || 0,
		currentPage: parseInt(searchParams.get("page") || "1"),
	};
};
