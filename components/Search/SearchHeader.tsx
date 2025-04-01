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
		<div className='flex items-center gap-1 py-2 text-sm text-center'>
			<h1 className='font-bold font-poppins'>
				{query
					? `Search Results for "${query}"`
					: "All Jobs: "}
				{location && ` in ${location}`}
			</h1>
			<span className='flex gap-1 text-myBlack font-openSans'>
				<p>{jobCount} jobs found</p>
			</span>
		</div>
	);
};

export default SearchHeader;
