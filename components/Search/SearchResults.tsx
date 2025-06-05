import { SearchJobResult } from "@/types/types";
import SearchJobList from "./SearchJobList";
import NoResultsMessage from "./NoResultsMessage";
import { LoadingComponent } from "../Loading";

interface SearchResultsProps {
	jobs: SearchJobResult[];
	isLoading: boolean;
	hasSearched?: boolean;
	query?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
	jobs,
	isLoading,
	hasSearched = false,
	query = "",
}) => {
	return (
		<div className='md:w-3/4 flex-grow'>
			<div className='min-h-[60vh] relative'>
				{isLoading ? (
					<div className='absolute inset-0 flex items-center justify-center bg-white/50'>
						<LoadingComponent />
					</div>
				) : jobs.length > 0 ? (
					<SearchJobList jobs={jobs} />
				) : (
					<NoResultsMessage
						hasSearched={hasSearched}
						query={query}
					/>
				)}
			</div>
		</div>
	);
};

export default SearchResults;
