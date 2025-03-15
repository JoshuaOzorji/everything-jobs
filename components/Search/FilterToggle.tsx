import React from "react";

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
			className='w-full p-3 mb-4 text-center text-white rounded bg-pry md:hidden'
			onClick={() => setShowFilters(!showFilters)}>
			{showFilters ? "Hide Filters" : "Show Filters"}
		</button>
	);
};

export default FilterToggle;
