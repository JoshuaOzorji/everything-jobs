import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface CompanyDataResponse {
	exists: boolean;
}

const fetchCompanyData = async (): Promise<CompanyDataResponse> => {
	const response = await fetch("/api/company/check");
	if (!response.ok) {
		throw new Error("Failed to check company data");
	}
	return response.json();
};

export const useCompanyData = () => {
	const { data: session } = useSession();

	const query = useQuery<CompanyDataResponse, Error>({
		queryKey: ["company-data"],
		queryFn: fetchCompanyData,
		staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
		gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache (replaces cacheTime)
		refetchOnWindowFocus: true, // Refresh when user returns to tab
		retry: 2,
		// Use session data as initial data to eliminate loading states
		// Check if user has companyId in session (based on your MongoDB structure)
		initialData: session?.user?.companyId
			? {
					exists: Boolean(session.user.companyId),
				}
			: undefined,
		// Only fetch if we don't have reliable session data
		enabled: true,
	});

	return {
		hasCompanyData: query.data?.exists ?? null,
		loading: query.isLoading,
		error: query.error?.message ?? null,
		refetch: query.refetch,
	};
};
