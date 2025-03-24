import React from "react";
import { FilterOptions } from "@/types";
import FilterSelect from "./FilterSelect";

interface FilterSidebarProps {
	filters: FilterOptions | null;
	jobType: string;
	jobLevel: string;
	qualification: string;
	jobField: string;
	showFilters: boolean;
	updateFilters: (filterName: string, value: string) => void;
	clearAllFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
	filters,
	jobType,
	jobLevel,
	qualification,
	jobField,
	showFilters,
	updateFilters,
	clearAllFilters,
}) => {
	if (!filters) return null;

	return (
		<div
			className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 bg-white p-3 rounded shadow font-poppins text-sm`}>
			<h2 className='mb-4 text-lg font-semibold'>
				Filter Results
			</h2>

			<FilterSelect
				label='Job Type'
				value={jobType}
				options={filters.jobTypes}
				onChange={(value) =>
					updateFilters("jobType", value)
				}
				placeholder='All Job Types'
			/>

			<FilterSelect
				label='Experience Level'
				value={jobLevel}
				options={filters.jobLevels}
				onChange={(value) =>
					updateFilters("jobLevel", value)
				}
				placeholder='All Levels'
			/>

			<FilterSelect
				label='Qualification'
				value={qualification}
				options={filters.qualifications}
				onChange={(value) =>
					updateFilters("qualification", value)
				}
				placeholder='All Qualifications'
			/>

			<FilterSelect
				label='Job Field'
				value={jobField}
				options={filters.jobFields}
				onChange={(value) =>
					updateFilters("jobField", value)
				}
				placeholder='All Fields'
			/>

			<button
				onClick={clearAllFilters}
				className='w-full px-2 py-1 bg-gray-200 rounded text-myBlack hover:bg-gray-300'>
				Clear Filters
			</button>
		</div>
	);
};

export default FilterSidebar;
