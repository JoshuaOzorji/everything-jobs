"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterOptions, JobQuery } from "@/types";
import SearchHeader from "../../../components/Search/SearchHeader";
import FilterToggle from "../../../components/Search/FilterToggle";
import ActiveFilters from "../../../components/Search/ActiveFilters";
import FilterSidebar from "../../../components/Search/FilterSidebar";
import SearchResults from "../../../components/Search/SearchResults";

const SearchPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [jobs, setJobs] = useState<JobQuery[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<FilterOptions | null>(null);
	const [showFilters, setShowFilters] = useState(false);

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
			setLoading(true);
			try {
				// Create query string for the API
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
				setLoading(false);
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

	// Clear all filter values except search query and location
	const clearAllFilters = () => {
		router.push(
			`/search${query ? `?q=${query}` : ""}${location ? `&location=${location}` : ""}`,
		);
	};

	return (
		<main>
			<div className='mx-auto '>
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

				<div className='flex flex-col gap-4 my-2 md:flex-row'>
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

					<SearchResults
						isLoading={loading}
						jobs={jobs}
					/>
				</div>
			</div>
		</main>
	);
};

export default SearchPage;
