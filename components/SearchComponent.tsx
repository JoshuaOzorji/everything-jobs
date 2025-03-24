"use client";

import { client } from "@/sanity/lib/client";
import React, { FormEvent, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const fetchLocationsQuery = `
  *[_type == "state" && 
    count(*[_type == "job" && references(^._id)]) > 0 && 
    name != "Remote"] { 
    _id, 
    name 
  }
`;

const SearchComponent = ({
	isSearchOpen,
	setIsSearchOpen,
}: {
	isSearchOpen: boolean;
	setIsSearchOpen: (value: boolean) => void;
}) => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [locations, setLocations] = useState<
		{ _id: string; name: string }[]
	>([]);
	const [selectedLocation, setSelectedLocation] = useState("");

	// Fetch locations from Sanity
	useEffect(() => {
		const fetchStates = async () => {
			const data = await client.fetch(fetchLocationsQuery);
			setLocations(data);
		};
		fetchStates();
	}, []);

	// Handle select change
	const handleLocationChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setSelectedLocation(event.target.value);
	};

	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSearchQuery(event.target.value);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		//Create query params
		const params = new URLSearchParams();
		if (searchQuery) params.append("q", searchQuery);
		if (selectedLocation)
			params.append("location", selectedLocation);

		//Navigate to search page with params
		router.push(`/search?${params.toString()}`);

		// Close search after submission
		setIsSearchOpen(false);
	};

	// Escape key listener
	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (isSearchOpen && event.key === "Escape") {
				setIsSearchOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [isSearchOpen, setIsSearchOpen]);

	return (
		<div
			className={`overflow-hidden transition-[max-height] ${
				isSearchOpen
					? "duration-500 ease-in transition-all max-h-[300px] py-1 md:py-1.5"
					: "duration-300 ease-out transition-all max-h-0"
			} bg-acc shadow-md font-poppins`}>
			<div className='mx-4 my-2 md:my-3 md:mx-8 '>
				{/* inputs divider */}
				<form onSubmit={handleSubmit}>
					<div className='flex flex-wrap items-center justify-between w-full mx-auto border border-pry2 md:flex-row md:w-3/5'>
						<input
							type='search'
							placeholder='Search Jobs or Company'
							className='border border-r-pry hero-input'
							value={searchQuery}
							onChange={
								handleSearchChange
							}
						/>

						{/* Location Dropdown */}
						<select
							className='border hero-input'
							value={selectedLocation}
							onChange={
								handleLocationChange
							}>
							<option value=''>
								Select Location
							</option>
							{locations.map(
								(location) => (
									<option
										key={
											location._id
										}
										value={
											location.name
										}>
										{
											location.name
										}
									</option>
								),
							)}
						</select>

						<button
							type='submit'
							className='p-1 text-white border md:p-[0.38rem] bg-pry2 hover:bg-pry animate hover:text-acc border-pry2'>
							<IoSearchOutline className='w-6 h-6' />
						</button>
						{/* Search Icon */}
					</div>
				</form>
			</div>
		</div>
	);
};

export default SearchComponent;
