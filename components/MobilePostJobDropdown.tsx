"use client";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { navigationLinks } from "@/lib/data";

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
				className='flex items-center justify-between w-full px-4 py-2 transition-colors rounded hover:bg-gray-100'
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
					className='pl-4 mt-1 text-[13px]'>
					{navigationLinks.map((link, index) => (
						<li key={index}>
							<Link
								href={link.href}
								className='block px-4 py-1 space-y-1 transition-colors rounded hover:bg-gray-100'
								onClick={
									handleLinkClickWithClose
								}>
								{link.label}
							</Link>
						</li>
					))}

					<li>
						<button
							onClick={handleSignOut}
							className='w-full px-4 py-1 text-left text-red-600 transition-colors rounded hover:bg-gray-100'>
							Logout
						</button>
					</li>
				</ul>
			)}
		</div>
	);
};

export default MobilePostJobDropdown;
