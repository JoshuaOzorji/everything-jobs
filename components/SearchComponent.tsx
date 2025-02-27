import Link from "next/link";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchComponent = () => {
	return (
		<div className='bg-[#e1e5f2] border-b font-poppins'>
			<div className='mx-4 my-2 md:my-3 md:mx-8'>
				{/* all contents divider */}

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
						<IoSearchOutline className='w-6 h-6 ' />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SearchComponent;
