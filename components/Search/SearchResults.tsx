// import { JobQuery } from "@/types";
// import JobList from "./JobList";
// import NoResultsMessage from "./NoResultsMessage";
// import { LoadingComponent } from "../Loading";

// interface SearchResultsProps {
// 	jobs: JobQuery[];
// 	isLoading: boolean;
// }

// const SearchResults: React.FC<SearchResultsProps> = ({ jobs, isLoading }) => {
// 	return (
// 		<div className='md:w-3/4'>
// 			<div className='min-h-[50vh] relative'>
// 				{isLoading ? (
// 					<div className='absolute inset-0 flex items-center justify-center'>
// 						<LoadingComponent />
// 					</div>
// 				) : jobs.length > 0 ? (
// 					<JobList jobs={jobs} />
// 				) : (
// 					<NoResultsMessage />
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default SearchResults;

import { JobQuery } from "@/types";
import JobList from "./JobList";
import NoResultsMessage from "./NoResultsMessage";
import { LoadingComponent } from "../Loading";

interface SearchResultsProps {
	jobs: JobQuery[];
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
		<div className='md:w-3/4'>
			<div className='min-h-[50vh] relative'>
				{isLoading ? (
					<div className='absolute inset-0 flex items-center justify-center'>
						{/* <div className='absolute inset-0 flex items-center justify-center w-full h-full'> */}
						<LoadingComponent />
					</div>
				) : jobs.length > 0 ? (
					<JobList jobs={jobs} />
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
