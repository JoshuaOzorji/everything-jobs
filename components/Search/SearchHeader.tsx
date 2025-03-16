interface SearchHeaderProps {
	query: string | null;
	location: string | null;
	jobCount: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
	query,
	location,
	jobCount,
}) => {
	return (
		<div className='flex items-center gap-4 p-2 text-center text-sm'>
			<h1 className='font-poppins font-bold'>
				{query
					? `Search Results for "${query}"`
					: "All Jobs"}
				{location && ` in ${location}`}
			</h1>
			<span className='flex gap-1 text-gray-600 font-openSans'>
				&bull; <p>{jobCount} jobs found</p>
			</span>
		</div>
	);
};

export default SearchHeader;
