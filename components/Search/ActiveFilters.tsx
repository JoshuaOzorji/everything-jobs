import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ActiveFiltersProps {
	location: string;
	jobType: string;
	jobLevel: string;
	education: string;
	jobField: string;
	query: string;
	updateFilters: (filterName: string, value: string) => void;
}

type FilterName = "Location" | "Job Type" | "Level" | "Education" | "Field";

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
	location,
	jobType,
	jobLevel,
	education,
	jobField,
	query,
	updateFilters,
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Map filter display names to their actual parameter names
	const filterMapping: Record<FilterName, string> = {
		Location: "location",
		"Job Type": "jobType",
		Level: "jobLevel",
		Education: "education",
		Field: "jobField",
	};

	const activeFilters = [
		{ name: "Location", value: location },
		{ name: "Job Type", value: jobType },
		{ name: "Level", value: jobLevel },
		{ name: "Education", value: education },
		{ name: "Field", value: jobField },
	].filter((filter) => filter.value);

	// if (activeFilters.length === 0) return null;

	const shouldShowComponent =
		activeFilters.length > 0 || (query && query.length > 0);

	if (!shouldShowComponent) return null;

	const handleClearAll = () => {
		// Clear all filter values by calling updateFilters for each one
		updateFilters("location", "");
		updateFilters("jobtype", "");
		updateFilters("joblevel", "");
		updateFilters("education", "");
		updateFilters("jobfield", "");

		// Navigate to search page with only query parameter if it exists
		router.push(`/search${query ? `?q=${query}` : ""}`);
	};

	return (
		<div className='flex flex-wrap items-center gap-2 p-2 mb-4 text-sm'>
			<h3 className='font-bold text-center font-poppins'>
				Active Filters:
			</h3>

			<div className='flex flex-wrap gap-2 font-openSans'>
				{activeFilters.map((filter) => (
					<div
						key={filter.name}
						className='flex items-center px-2 text-sm bg-blue-100 rounded'>
						<span>
							{filter.name}:{" "}
							{filter.value}
						</span>
						<button
							onClick={() =>
								updateFilters(
									filterMapping[
										filter.name as FilterName
									],
									"",
								)
							}
							className='ml-2 text-gray-500 hover:text-gray-700'>
							×
						</button>
					</div>
				))}

				<button
					onClick={handleClearAll}
					className='px-2 py-1 text-sm text-red-600 underline'>
					Clear all
				</button>
			</div>
		</div>
	);
};

export default ActiveFilters;
