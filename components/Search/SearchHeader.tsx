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
		<div className='mb-6'>
			<h1 className='text-2xl font-bold'>
				{query
					? `Search Results for "${query}"`
					: "All Jobs"}
				{location && ` in ${location}`}
			</h1>
			<p className='mt-2 text-gray-600'>
				{jobCount} jobs found
			</p>
		</div>
	);
};

export default SearchHeader;
