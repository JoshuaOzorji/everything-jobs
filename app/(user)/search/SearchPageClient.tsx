"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FilterOptions, SearchJobResult } from "@/types/types";
import SearchHeader from "@/components/Search/SearchHeader";
import FilterToggle from "@/components/Search/FilterToggle";
import ActiveFilters from "@/components/Search/ActiveFilters";
import FilterSidebar from "@/components/Search/FilterSidebar";
import SearchResults from "@/components/Search/SearchResults";
import { useSearchJobs, useFilters } from "@/hooks/useSearch";
import { toast } from "sonner";
import { useEffect } from "react";
import Pagination from "@/components/Pagination";

interface SearchPageClientProps {
	initialJobs: SearchJobResult[];
	initialFilters: FilterOptions;
	currentPage: number;
	perPage: number;
	searchParams: {
		q?: string;
		location?: string;
		jobType?: string;
		jobLevel?: string;
		education?: string;
		jobField?: string;
		page?: string;
	};
}

const SearchPageClient = ({
	initialJobs,
	initialFilters,
	currentPage,
	perPage,
	searchParams: initialSearchParams,
}: SearchPageClientProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [showFilters, setShowFilters] = useState(false);

	// Get current filter values from URL
	const currentParams = {
		q: searchParams.get("q") || "",
		location: searchParams.get("location") || "",
		jobType: searchParams.get("jobType") || "",
		jobLevel: searchParams.get("jobLevel") || "",
		education: searchParams.get("education") || "",
		jobField: searchParams.get("jobField") || "",
		page: searchParams.get("page") || "1",
	};

	// Use React Query with initial data for hydration
	const {
		data: jobsData,
		isLoading: jobsLoading,
		error: jobsError,
		isFetching: jobsFetching,
	} = useSearchJobs(currentParams);

	const {
		data: filtersData,
		isLoading: filtersLoading,
		error: filtersError,
	} = useFilters();

	// Use server data as fallback
	const jobs = jobsData?.jobs ?? initialJobs;
	const totalJobs = jobsData?.total ?? initialJobs.length;
	const filters = filtersData ?? initialFilters;

	// Determine if search has been performed - now only considers query text and location as "search"
	// Other filters are considered filtering, not searching
	const hasSearched =
		currentParams.q.trim() !== "" ||
		currentParams.location.trim() !== "";

	// Check if any filters are applied (for showing active filters)
	const hasActiveFilters = Object.values(currentParams).some(
		(value) => value && value.trim() !== "",
	);

	// Handle errors with toast
	useEffect(() => {
		if (jobsError) {
			toast.error(
				"Failed to load job results. Please try again.",
			);
		}
		if (filtersError) {
			toast.error(
				"Failed to load filters. Please refresh the page.",
			);
		}
	}, [jobsError, filtersError]);

	// Update URL with filter selection
	const updateFilters = (filterName: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (value) {
			params.set(filterName, value);
		} else {
			params.delete(filterName);
		}

		// Reset to page 1 when filters change
		params.delete("page");

		router.push(`/search?${params.toString()}`);
	};

	const clearAllFilters = () => {
		router.push("/search");
	};

	return (
		<main className='mx-auto'>
			<div className='px-2 bg-white rounded-md'>
				<SearchHeader
					query={currentParams.q}
					location={currentParams.location}
					jobCount={jobs.length}
				/>

				<FilterToggle
					showFilters={showFilters}
					setShowFilters={setShowFilters}
				/>

				{hasActiveFilters && (
					<ActiveFilters
						location={
							currentParams.location
						}
						jobType={currentParams.jobType}
						jobLevel={
							currentParams.jobLevel
						}
						education={
							currentParams.education
						}
						jobField={
							currentParams.jobField
						}
						query={currentParams.q}
						updateFilters={updateFilters}
					/>
				)}
			</div>

			<div className='flex flex-col gap-6 my-2 md:flex-row'>
				{filtersLoading ? (
					<div className='hidden md:w-1/4 min-h-[60vh] bg-gray-100 animate-pulse rounded'></div>
				) : (
					<FilterSidebar
						filters={filters}
						query={currentParams.q}
						location={
							currentParams.location
						}
						jobType={currentParams.jobType}
						jobLevel={
							currentParams.jobLevel
						}
						education={
							currentParams.education
						}
						jobField={
							currentParams.jobField
						}
						showFilters={showFilters}
						updateFilters={updateFilters}
						clearAllFilters={
							clearAllFilters
						}
					/>
				)}

				<SearchResults
					isLoading={jobsLoading || jobsFetching}
					jobs={jobs}
					hasSearched={hasSearched}
					query={currentParams.q}
				/>
			</div>

			{/* Pagination */}
			{totalJobs > perPage && (
				<Pagination
					currentPage={parseInt(
						currentParams.page,
						10,
					)}
					total={totalJobs}
					perPage={perPage}
				/>
			)}
		</main>
	);
};

export default SearchPageClient;
