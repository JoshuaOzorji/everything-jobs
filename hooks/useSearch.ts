import { useQuery } from "@tanstack/react-query";
import { SearchJobResult, FilterOptions } from "@/types/types";

interface SearchParams {
	q?: string;
	location?: string;
	jobType?: string;
	jobLevel?: string;
	education?: string;
	jobField?: string;
}

interface SearchResponse {
	jobs: SearchJobResult[];
	filters: FilterOptions;
}

const fetchSearchResults = async (
	params: SearchParams,
): Promise<SearchResponse> => {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value && value.trim() !== "") {
			searchParams.append(key, value);
		}
	});

	const response = await fetch(`/api/search?${searchParams.toString()}`);

	if (!response.ok) {
		throw new Error("Failed to fetch search results");
	}

	return response.json();
};

export const useSearchJobs = (params: SearchParams) => {
	// Create a stable query key that changes when filters change
	const queryKey = ["search", params];

	// Determine if we should enable the query (has any search criteria)
	const hasSearchCriteria = Object.values(params).some(
		(value) => value && value.trim() !== "",
	);

	return useQuery({
		queryKey,
		queryFn: () => fetchSearchResults(params),
		enabled: hasSearchCriteria,
		// More aggressive stale time for search results since they don't change frequently
		staleTime: 10 * 60 * 1000, // 10 minutes
		// Keep search results cached longer
		gcTime: 30 * 60 * 1000, // 30 minutes
	});
};

// Separate hook for filters only (can be cached longer)
export const useFilters = () => {
	return useQuery({
		queryKey: ["filters"],
		queryFn: async (): Promise<FilterOptions> => {
			const response = await fetch("/api/filters");
			if (!response.ok) {
				throw new Error("Failed to fetch filters");
			}
			return response.json();
		},
		// Filters change very rarely, so cache them longer
		staleTime: 60 * 60 * 1000, // 1 hour
		gcTime: 2 * 60 * 60 * 1000, // 2 hours
	});
};
