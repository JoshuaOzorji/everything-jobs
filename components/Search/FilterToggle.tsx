interface FilterToggleProps {
	showFilters: boolean;
	setShowFilters: (show: boolean) => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
	showFilters,
	setShowFilters,
}) => {
	return (
		<button
			className='w-full p-2 mb-3 text-sm text-center text-white rounded bg-pry2 hover:bg-pry md:hidden font-saira animate'
			onClick={() => setShowFilters(!showFilters)}>
			{showFilters ? "Hide Filters" : "Show Filters"}
		</button>
	);
};

export default FilterToggle;
