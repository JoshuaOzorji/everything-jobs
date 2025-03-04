"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const SearchComponent = ({
	isSearchOpen,
	setIsSearchOpen,
}: {
	isSearchOpen: boolean;
	setIsSearchOpen: (value: boolean) => void;
}) => {
	const handleClose = () => {
		setIsSearchOpen(false);
	};

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
			className='absolute left-0 right-0 w-full overflow-hidden transition-all duration-300 ease-in-out'
			style={{
				height: isSearchOpen ? "auto" : "0px", // Control height instead of transform
				top: "100%",
				zIndex: 40,
				pointerEvents: isSearchOpen ? "auto" : "none", // Disable interaction when closed
			}}>
			<div className='bg-white shadow-md'>
				<div className='p-4 border-b flex justify-between items-center'>
					<h2 className='text-xl font-semibold'>
						Search
					</h2>
					<button
						onClick={handleClose}
						className='p-1 rounded-full hover:bg-gray-100 transition-colors'
						aria-label='Close search'>
						<IoClose className='w-6 h-6' />
					</button>
				</div>
				<div className='bg-[#e1e5f2] border-b font-poppins'>
					<div className='mx-4 my-2 md:my-3 md:mx-8'>
						{/* inputs divider */}
						<div className='flex flex-wrap items-center justify-between w-full mx-auto border md:flex-row border-pry md:w-3/5'>
							<input
								type='search'
								placeholder='Search Jobs or Company'
								className='border-r border-pry hero-input'
							/>

							<input
								type='text'
								placeholder='Location'
								className='hero-input border-pry'
							/>

							{/* Search Icon */}
							<Link
								href='/'
								className='p-1 md:p-1.5 bg-pry hover:bg-[#e1e5f2] animate text-acc2 hover:text-pry'>
								<IoSearchOutline className='w-6 h-6' />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchComponent;
