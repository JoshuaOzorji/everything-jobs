"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import SearchComponent from "./SearchComponent";
import { LoadingComponent } from "@/components/Loading";

interface HeaderProps {
	initialSession?: any;
}

const Header = ({ initialSession }: HeaderProps) => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const pathname = usePathname();

	const openSearch = () => {
		setIsMenuOpen(false);
		setIsSearchOpen(true);
	};

	const closeSearch = () => {
		setIsSearchOpen(false);
	};

	const openMenu = () => {
		setIsSearchOpen(false);
		setIsMenuOpen(true);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const toggleSearch = () => {
		if (isSearchOpen) {
			closeSearch();
		} else {
			openSearch();
		}
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	};

	// Handle search loading state
	const handleSearchStart = () => {
		setIsSearchLoading(true);
	};

	// Listen for route changes to stop loading
	useEffect(() => {
		// When pathname changes to search page, stop loading
		if (pathname.startsWith("/search") && isSearchLoading) {
			// Small delay to ensure smooth transition
			const timer = setTimeout(() => {
				setIsSearchLoading(false);
			}, 300);

			return () => clearTimeout(timer);
		}
	}, [pathname, isSearchLoading]);

	return (
		<>
			<header className='sticky top-0 z-50 bg-white shadow'>
				<div className='relative z-50'>
					<div className='md:hidden'>
						<MobileNav
							toggleSearch={
								toggleSearch
							}
							isSearchOpen={
								isSearchOpen
							}
							isMenuOpen={isMenuOpen}
							toggleMenu={toggleMenu}
							closeMenu={closeMenu}
							initialSession={
								initialSession
							}
						/>
					</div>
					<div className='hidden md:block'>
						<MainNav
							toggleSearch={
								toggleSearch
							}
							isSearchOpen={
								isSearchOpen
							}
							// initialSession={initialSession}
						/>
					</div>
				</div>

				{/* Search component below */}
				<SearchComponent
					isSearchOpen={isSearchOpen}
					setIsSearchOpen={setIsSearchOpen}
					onSearchStart={handleSearchStart}
				/>
			</header>

			{/* Loading component beneath the header */}
			{isSearchLoading && <LoadingComponent />}
		</>
	);
};

export default Header;
