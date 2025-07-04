"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterOptions, SearchJobResult } from "@/types/types";
import SearchHeader from "@/components/Search/SearchHeader";
import FilterToggle from "@/components/Search/FilterToggle";
import ActiveFilters from "@/components/Search/ActiveFilters";
import FilterSidebar from "@/components/Search/FilterSidebar";
import SearchResults from "@/components/Search/SearchResults";

const SearchPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [jobs, setJobs] = useState<SearchJobResult[]>([]);
	const [filters, setFilters] = useState<FilterOptions | null>(null);
	const [showFilters, setShowFilters] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Get current filter values from URL
	const query = searchParams.get("q") || "";
	const location = searchParams.get("location") || "";
	const jobType = searchParams.get("jobType") || "";
	const jobLevel = searchParams.get("jobLevel") || "";
	const education = searchParams.get("education") || "";
	const jobField = searchParams.get("jobField") || "";

	// Fetch jobs based on search params
	useEffect(() => {
		const fetchJobs = async () => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams();
				if (query) params.append("q", query);
				if (location)
					params.append("location", location);
				if (jobType) params.append("jobType", jobType);
				if (jobLevel)
					params.append("jobLevel", jobLevel);
				if (education)
					params.append("education", education);
				if (jobField)
					params.append("jobField", jobField);

				// Track if there's an active search
				setHasSearched(
					query !== "" ||
						location !== "" ||
						jobType !== "" ||
						jobLevel !== "" ||
						education !== "" ||
						jobField !== "",
				);

				const response = await fetch(
					`/api/search?${params.toString()}`,
				);
				const data = await response.json();

				if (data.jobs) {
					setJobs(data.jobs);
				}

				if (data.filters) {
					setFilters(data.filters);
				}
			} catch (error) {
				console.error("Error fetching jobs:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchJobs();
	}, [query, location, jobType, jobLevel, education, jobField]);

	// Update URL with filter selection
	const updateFilters = (filterName: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (value) {
			params.set(filterName, value);
		} else {
			params.delete(filterName);
		}

		router.push(`/search?${params.toString()}`);
	};

	const clearAllFilters = () => {
		router.push("/search");
	};

	return (
		<main className='mx-auto'>
			<div className='px-2 bg-white rounded-md'>
				<SearchHeader
					query={query}
					location={location}
					jobCount={jobs.length}
				/>

				<FilterToggle
					showFilters={showFilters}
					setShowFilters={setShowFilters}
				/>

				<ActiveFilters
					location={location}
					jobType={jobType}
					jobLevel={jobLevel}
					education={education}
					jobField={jobField}
					query={query}
					updateFilters={updateFilters}
				/>
			</div>

			<div className='flex flex-col gap-6 my-2 md:flex-row'>
				{filters === null ? (
					<div className='md:w-1/4 min-h-[60vh] bg-gray-100 animate-pulse rounded'></div>
				) : (
					<FilterSidebar
						filters={filters}
						query={query}
						location={location}
						jobType={jobType}
						jobLevel={jobLevel}
						education={education}
						jobField={jobField}
						showFilters={showFilters}
						updateFilters={updateFilters}
						clearAllFilters={
							clearAllFilters
						}
					/>
				)}

				<SearchResults
					isLoading={isLoading}
					jobs={jobs}
					hasSearched={hasSearched}
					query={query}
				/>
			</div>
		</main>
	);
};

export default SearchPage;
