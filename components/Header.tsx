"use client";

import { useState } from "react";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import SearchComponent from "./SearchComponent";

const Header = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const toggleSearch = () => {
		setIsSearchOpen((prev) => !prev);
	};

	return (
		<header className='bg-white relative'>
			{/* Header content always at top z-index */}
			<div className='relative z-50'>
				<div className='md:hidden'>
					<MobileNav
						toggleSearch={toggleSearch}
						isSearchOpen={isSearchOpen}
					/>
				</div>
				<div className='hidden md:block'>
					<MainNav
						toggleSearch={toggleSearch}
						isSearchOpen={isSearchOpen}
					/>
				</div>
			</div>

			{/* Search component below */}
			<SearchComponent
				isSearchOpen={isSearchOpen}
				setIsSearchOpen={setIsSearchOpen}
			/>
		</header>
	);
};

export default Header;
