import { useState, useEffect } from "react";

interface CompanyDataState {
	hasCompanyData: boolean | null;
	loading: boolean;
	error: string | null;
}

export const useCompanyData = () => {
	const [state, setState] = useState<CompanyDataState>({
		hasCompanyData: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		const checkCompanyData = async () => {
			try {
				const response =
					await fetch("/api/company/check");
				if (!response.ok)
					throw new Error(
						"Failed to check company data",
					);
				const data = await response.json();
				setState({
					hasCompanyData: data.exists,
					loading: false,
					error: null,
				});
			} catch (error) {
				setState({
					hasCompanyData: false,
					loading: false,
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
				});
			}
		};
		checkCompanyData();
	}, []);

	const refetch = async () => {
		setState((prev) => ({ ...prev, loading: true }));
		try {
			const response = await fetch("/api/company/check");
			const data = await response.json();
			setState({
				hasCompanyData: data.exists,
				loading: false,
				error: null,
			});
		} catch (error) {
			setState({
				hasCompanyData: false,
				loading: false,
				error:
					error instanceof Error
						? error.message
						: "Unknown error",
			});
		}
	};

	return {
		...state,
		refetch,
	};
};
