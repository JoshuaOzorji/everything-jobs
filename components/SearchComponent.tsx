"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchComponent = ({
	isSearchOpen,
	setIsSearchOpen,
}: {
	isSearchOpen: boolean;
	setIsSearchOpen: (value: boolean) => void;
}) => {
	// Add keyboard support for Escape key to close search
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
				<div className='flex flex-wrap items-center justify-between w-full mx-auto border md:flex-row md:w-3/5 border-pry'>
					<input
						type='search'
						placeholder='Search Jobs or Company'
						className='border border-r-pry hero-input'
					/>

					<input
						type='text'
						placeholder='Location'
						className='border hero-input'
					/>

					{/* Search Icon */}
					<Link
						href='/'
						className='p-1 md:p-1.5 bg-pry hover:bg-sec animate hover:text-acc text-white border-pry border'>
						<IoSearchOutline className='w-6 h-6' />
						{/* <p className="text-sm md:text-base">Search</p> */}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SearchComponent;
