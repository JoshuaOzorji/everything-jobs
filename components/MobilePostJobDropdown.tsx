"use client";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";

interface MobilePostJobDropdownProps {
	onLinkClick: () => void;
}

const MobilePostJobDropdown = ({ onLinkClick }: MobilePostJobDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession();

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/" });
		onLinkClick(); // Close the menu after signing out
	};

	const handleLinkClickWithClose = () => {
		onLinkClick(); // Close the menu when a link is clicked
	};

	return (
		<div className='relative'>
			<button
				className='flex items-center justify-between w-full py-2 px-4 hover:bg-gray-100 rounded transition-colors'
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-controls='mobile-post-job-dropdown'>
				<span>Account</span>
				{isOpen ? (
					<IoIosArrowUp className='w-4 h-4 ml-2' />
				) : (
					<IoIosArrowDown className='w-4 h-4 ml-2' />
				)}
			</button>

			{isOpen && (
				<ul
					id='mobile-post-job-dropdown'
					className='pl-4 mt-1 space-y-1'>
					<li>
						<Link
							href='/dashboard'
							className='block py-2 px-4 hover:bg-gray-100 rounded transition-colors text-sm'
							onClick={
								handleLinkClickWithClose
							}>
							Dashboard
						</Link>
					</li>
					<li>
						<Link
							href='/dashboard/post-job'
							className='block py-2 px-4 hover:bg-gray-100 rounded transition-colors text-sm'
							onClick={
								handleLinkClickWithClose
							}>
							Post Job
						</Link>
					</li>
					<li>
						<Link
							href='/dashboard/view-jobs'
							className='block py-2 px-4 hover:bg-gray-100 rounded transition-colors text-sm'
							onClick={
								handleLinkClickWithClose
							}>
							Job Submissions
						</Link>
					</li>
					<li>
						<Link
							href='/dashboard/company-profile'
							className='block py-2 px-4 hover:bg-gray-100 rounded transition-colors text-sm'
							onClick={
								handleLinkClickWithClose
							}>
							Company Profile
						</Link>
					</li>

					<li>
						<button
							onClick={handleSignOut}
							className='w-full text-left py-2 px-4 hover:bg-gray-100 rounded transition-colors text-sm text-red-600'>
							Logout
						</button>
					</li>
				</ul>
			)}
		</div>
	);
};

export default MobilePostJobDropdown;
