"use client";

import React, { useEffect, useState } from "react";
import { FilterOptions } from "@/types/types";
import FilterSelect from "./FilterSelect";

interface FilterSidebarProps {
	filters: FilterOptions | null;
	query: string;
	location: string;
	jobType: string;
	jobLevel: string;
	education: string;
	jobField: string;
	showFilters: boolean;
	updateFilters: (filterName: string, value: string) => void;
	clearAllFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
	filters,
	query,
	location,
	jobType,
	jobLevel,
	education,
	jobField,
	showFilters,
	updateFilters,
	clearAllFilters,
}) => {
	const [searchQuery, setSearchQuery] = useState(query);
	const [selectedLocationId, setSelectedLocationId] = useState("");

	useEffect(() => {
		setSearchQuery(query);

		if (filters?.locations && location) {
			const locationObj = filters.locations.find(
				(loc) => loc.name === location,
			);
			if (locationObj) {
				setSelectedLocationId(locationObj._id);
			} else if (location) {
				setSelectedLocationId("custom");
			} else {
				setSelectedLocationId("");
			}
		} else {
			setSelectedLocationId("");
		}
	}, [query, location, filters]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSearchSubmit = () => {
		updateFilters("q", searchQuery);
	};

	const handleLocationChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const selectedId = e.target.value;
		setSelectedLocationId(selectedId);

		const selectedLocation = filters?.locations?.find(
			(loc) => loc._id === selectedId,
		);

		const locationValue = selectedLocation
			? selectedLocation.name
			: selectedId === "custom"
				? location
				: "";

		updateFilters("location", locationValue);
	};

	if (!filters) return null;

	return (
		<div
			className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 bg-white p-3 rounded shadow font-poppins text-sm h-fit sticky top-2`}>
			<h2 className='mb-4 text-lg font-semibold'>
				Filter Results
			</h2>

			{/* Search Query Input */}
			<div className='mb-4'>
				<label className='block mb-1 font-medium'>
					Search Jobs
				</label>
				<div className='flex'>
					<input
						type='text'
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder='Job title or company'
						className='w-full px-2 py-1.5 border rounded-l border-gray-300 focus:outline-none focus:border-pry2'
					/>
					<button
						onClick={handleSearchSubmit}
						className='px-2 py-1.5 text-white bg-pry2 rounded-r hover:bg-pry'>
						Search
					</button>
				</div>
			</div>

			{/* Location Select */}

			<div className='mb-4'>
				<label className='block mb-1 font-medium'>
					Location
				</label>
				<select
					value={selectedLocationId}
					onChange={handleLocationChange}
					className='w-full px-2 py-1.5 border rounded border-gray-300 focus:outline-none focus:border-pry2'>
					<option value=''>All Locations</option>
					{filters.locations?.map((loc) => (
						<option
							key={loc._id}
							value={loc._id}>
							{loc.name}
						</option>
					))}
					{location &&
						selectedLocationId ===
							"custom" && (
							<option value='custom'>
								{location}
							</option>
						)}
				</select>
			</div>

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
				label='Education'
				value={education}
				options={filters.educationLevels}
				onChange={(value) =>
					updateFilters("education", value)
				}
				placeholder='All Education levels'
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
				className='w-full p-2 bg-gray-200 rounded text-myBlack hover:bg-gray-300'>
				Clear Filters
			</button>
		</div>
	);
};

export default FilterSidebar;
