import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types for company operations - matching your API structure
interface CompanyUpdateData {
	_id?: string; // Optional for creates, required for updates
	name: string;
	website?: string;
	industry: string;
	description?: string;
	logo?: any; // Sanity asset type
}

interface CompanyCreateData {
	name: string;
	website?: string;
	industry: string;
	description?: string;
	logo?: any; // Sanity asset type
}

// Hook for creating a new company
export const useCreateCompany = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, CompanyCreateData>({
		mutationFn: async (companyData: CompanyCreateData) => {
			const response = await fetch("/api/company-profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(companyData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (
					response.status === 400 &&
					errorData.error ===
						"User already has a company profile."
				) {
					throw new Error(
						"User already has a company profile.",
					);
				}
				throw new Error(
					errorData.error ||
						"Failed to create company",
				);
			}
			return response.json();
		},
		onMutate: async () => {
			// Optimistic update - immediately show company exists
			await queryClient.cancelQueries({
				queryKey: ["company-data"],
			});
			queryClient.setQueryData(["company-data"], {
				exists: true,
			});
		},
		onSuccess: () => {
			// Invalidate and refetch to get latest data
			queryClient.invalidateQueries({
				queryKey: ["company-data"],
			});
			// You might also want to invalidate session data
			queryClient.invalidateQueries({
				queryKey: ["session"],
			});
		},
		onError: () => {
			// Revert optimistic update on error
			queryClient.invalidateQueries({
				queryKey: ["company-data"],
			});
		},
	});
};

// Hook for updating existing company
export const useUpdateCompany = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, CompanyUpdateData>({
		mutationFn: async (companyData: CompanyUpdateData) => {
			if (!companyData._id) {
				throw new Error(
					"Company ID is required for updates",
				);
			}

			const response = await fetch("/api/company-profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(companyData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error ||
						"Failed to update company",
				);
			}
			return response.json();
		},
		onSuccess: () => {
			// After successful update, refresh company data everywhere
			queryClient.invalidateQueries({
				queryKey: ["company-data"],
			});
			// Also invalidate session to update user context
			queryClient.invalidateQueries({
				queryKey: ["session"],
			});
		},
	});
};
