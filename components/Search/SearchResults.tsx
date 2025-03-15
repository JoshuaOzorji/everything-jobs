import React from "react";
import { JobQuery } from "@/types";
import LoadingSpinner from "../LoadingSpinner";
import JobList from "./JobList";
import NoResultsMessage from "./NoResultsMessage";

interface SearchResultsProps {
	loading: boolean;
	jobs: JobQuery[];
	formatDate: (dateString: string) => string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
	loading,
	jobs,
	formatDate,
}) => {
	return (
		<div className='md:w-3/4'>
			{loading ? (
				<LoadingSpinner />
			) : jobs.length > 0 ? (
				<JobList jobs={jobs} formatDate={formatDate} />
			) : (
				<NoResultsMessage />
			)}
		</div>
	);
};

export default SearchResults;
