"use client";

import { useState } from "react";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import SearchComponent from "./SearchComponent";

interface HeaderProps {
	initialSession?: any;
}
const Header = ({ initialSession }: HeaderProps) => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleSearch = () => {
		setIsSearchOpen((prev) => !prev);
		// Close menu when search is opened
		if (!isSearchOpen) {
			setIsMenuOpen(false);
		}
	};

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
		if (!isMenuOpen) {
			setIsSearchOpen(false);
		}
	};

	return (
		<header className='sticky top-0 z-50 bg-white shadow'>
			<div className='relative z-50'>
				<div className='md:hidden'>
					<MobileNav
						toggleSearch={toggleSearch}
						isSearchOpen={isSearchOpen}
						isMenuOpen={isMenuOpen}
						toggleMenu={toggleMenu}
						initialSession={initialSession}
					/>
				</div>
				<div className='hidden md:block'>
					<MainNav
						toggleSearch={toggleSearch}
						isSearchOpen={isSearchOpen}
						// initialSession={initialSession}
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
