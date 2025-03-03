"use client";

import { useState } from "react";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import SearchComponent from "./SearchComponent";

const Header = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<>
			<main className='bg-white animate'>
				<div className='md:hidden'>
					<MobileNav
						setIsSearchOpen={
							setIsSearchOpen
						}
					/>
				</div>
				<div className='hidden md:block'>
					<MainNav
						setIsSearchOpen={
							setIsSearchOpen
						}
					/>
				</div>
				<SearchComponent
					isSearchOpen={isSearchOpen}
					setIsSearchOpen={setIsSearchOpen}
				/>
			</main>
		</>
	);
};

export default Header;
