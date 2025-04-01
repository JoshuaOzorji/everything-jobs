import { JobQuery } from "@/types";
import JobList from "./JobList";
import NoResultsMessage from "./NoResultsMessage";
import Loading from "@/app/(user)/loading";

interface SearchResultsProps {
	jobs: JobQuery[];
	isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ jobs, isLoading }) => {
	return (
		<div className='md:w-3/4'>
			{isLoading ? (
				<Loading />
			) : jobs.length > 0 ? (
				<JobList jobs={jobs} />
			) : (
				<NoResultsMessage />
			)}
		</div>
	);
};

export default SearchResults;
