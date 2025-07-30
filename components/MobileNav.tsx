"use client";

import logo from "@/public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CgMenu } from "react-icons/cg";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { findJobsDropdownItems } from "@/lib/data";
import { useSession } from "next-auth/react";
import MobilePostJobDropdown from "./MobilePostJobDropdown";

interface MobileNavProps {
	toggleSearch: () => void;
	isSearchOpen: boolean;
	isMenuOpen: boolean;
	toggleMenu: () => void;
	closeMenu: () => void;
	initialSession?: any;
}

const MobileNav = ({
	toggleSearch,
	isSearchOpen,
	isMenuOpen,
	toggleMenu,
	closeMenu,
	initialSession,
}: MobileNavProps) => {
	const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
	const { data: session, status } = useSession();

	// Use server session first, then fall back to client session
	const currentSession = session || initialSession;
	const isAuthenticated = currentSession?.user ? true : false;
	const isLoading = status === "loading" && !initialSession;

	const toggleJobsDropdown = () => {
		setIsJobsDropdownOpen((prev) => !prev);
	};

	// This function closes the menu when clicking a link or button
	const handleLinkClick = () => {
		closeMenu(); // This will close the menu
	};

	return (
		<nav className='relative'>
			<div className='flex items-center justify-between p-2'>
				<button
					onClick={toggleMenu}
					aria-label={
						isMenuOpen
							? "Close menu"
							: "Open menu"
					}>
					{isMenuOpen ? (
						<IoMdClose className='w-6 h-6' />
					) : (
						<CgMenu className='w-6 h-6' />
					)}
				</button>

				<Link href='/'>
					<Image
						src={logo}
						alt='logo'
						className='w-auto h-8'
					/>
				</Link>

				<div className='flex items-center gap-4'>
					<button
						onClick={toggleSearch}
						className={`p-2 transition-colors duration-200 ${
							isSearchOpen
								? "text-pry bg-slate-100 border-b-2 border-pry animate"
								: "text-black"
						}`}>
						<IoSearchOutline className='w-6 h-6' />
					</button>
				</div>
			</div>

			{/* Mobile menu dropdown */}
			{isMenuOpen && (
				<div className='absolute left-0 w-full bg-white shadow-lg rounded-b-lg transform transition-transform duration-200 z-40 mt-0.5 font-poppins'>
					<div className='py-4 px-2 max-h-[calc(100vh-80px)] overflow-y-auto'>
						<ul className='space-y-1 text-sm'>
							{/* Find Jobs Dropdown */}
							<li>
								<div className='relative'>
									<button
										className='flex items-center justify-between w-full px-4 py-2 transition-colors rounded hover:bg-gray-100'
										onClick={
											toggleJobsDropdown
										}
										aria-expanded={
											isJobsDropdownOpen
										}
										aria-controls='find-jobs-dropdown'>
										<span>
											Find
											Jobs
										</span>
										{isJobsDropdownOpen ? (
											<IoIosArrowUp className='w-4 h-4 ml-2' />
										) : (
											<IoIosArrowDown className='w-4 h-4 ml-2' />
										)}
									</button>

									{isJobsDropdownOpen && (
										<ul
											id='find-jobs-dropdown'
											className='pl-4 mt-1'>
											{findJobsDropdownItems.map(
												(
													item,
													index,
												) => (
													<li
														key={
															index
														}>
														<Link
															href={
																item.href
															}
															className='block px-4 py-1 text-[13px] transition-colors rounded hover:bg-gray-100'
															onClick={
																handleLinkClick
															}>
															{
																item.label
															}
														</Link>
													</li>
												),
											)}
										</ul>
									)}
								</div>
							</li>

							<li>
								<Link
									href='/remote-jobs'
									className='block px-4 py-2 transition-colors rounded hover:bg-gray-100'
									onClick={
										handleLinkClick
									}>
									Remote
									Jobs
								</Link>
							</li>

							<li>
								<Link
									href='/companies'
									className='block px-4 py-2 transition-colors rounded hover:bg-gray-100'
									onClick={
										handleLinkClick
									}>
									Find
									Company
								</Link>
							</li>

							{/* Post Job Button/Dropdown */}
							<li className='pt-2 mt-2 border-t'>
								{/* Show loading state while session is loading */}
								{isLoading ? (
									<div className='flex items-center justify-center px-4 py-2'>
										<div className='w-4 h-4 border-2 border-gray-300 rounded-full border-t-pry animate-spin'></div>
									</div>
								) : isAuthenticated ? (
									<MobilePostJobDropdown
										onLinkClick={
											handleLinkClick
										}
									/>
								) : (
									<Link
										href='/dashboard/post-job'
										className='block px-4 py-2 text-center text-white transition-colors rounded-md bg-pry hover:bg-pry/90'
										onClick={
											handleLinkClick
										}>
										Post
										Job
									</Link>
								)}
							</li>
						</ul>
					</div>
				</div>
			)}
		</nav>
	);
};

export default MobileNav;
