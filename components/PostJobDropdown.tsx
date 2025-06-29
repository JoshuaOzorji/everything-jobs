"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const PostJobDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession();
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(
					event.target as Node,
				)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener(
				"mousedown",
				handleClickOutside,
			);
	}, []);

	// Debug logging - remove this after fixing
	useEffect(() => {
		if (session?.user) {
			console.log("Session user data:", {
				name: session.user.name,
				email: session.user.email,
				submitterInfo: session.user.submitterInfo,
			});
		}
	}, [session]);

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/" });
	};

	// Enhanced function to get user initials with better fallbacks
	const getInitials = (
		name: string | null | undefined,
		email?: string | null,
	) => {
		// Try to get initials from name first
		if (name && name.trim()) {
			const trimmedName = name.trim();
			const words = trimmedName
				.split(/\s+/)
				.filter((word) => word.length > 0);

			if (words.length >= 2) {
				// Get first letter of first and last word
				return (
					words[0][0] + words[words.length - 1][0]
				).toUpperCase();
			} else if (words.length === 1) {
				// If only one word, take first two letters or just first letter
				return words[0].substring(0, 2).toUpperCase();
			}
		}

		// Fallback to email if name is not available
		if (email && email.includes("@")) {
			const emailPrefix = email.split("@")[0];
			return emailPrefix.substring(0, 2).toUpperCase();
		}

		// Ultimate fallback
		return "U";
	};

	// Try multiple sources for getting initials
	const userInitials = getInitials(
		session?.user?.name || session?.user?.submitterInfo?.name,
		session?.user?.email || session?.user?.submitterInfo?.email,
	);

	// Get display name with fallbacks
	const displayName =
		session?.user?.name ||
		session?.user?.submitterInfo?.name ||
		session?.user?.email?.split("@")[0] ||
		"User";

	return (
		<div className='relative font-poppins' ref={dropdownRef}>
			<button
				className='flex items-center justify-center w-9 h-9 rounded-full bg-pry text-white hover:bg-pry/90 transition-colors'
				onClick={() => setIsOpen(!isOpen)}
				title={displayName} // Show full name on hover
			>
				<span className='text-sm md:text-base font-bold'>
					{userInitials}
				</span>
			</button>

			{isOpen && (
				<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border'>
					{/* Show user info at top of dropdown */}
					<div className='px-4 py-2 border-b border-gray-100'>
						<p className='text-sm font-medium text-gray-900 truncate'>
							{displayName}
						</p>
						<p className='text-xs text-gray-500 truncate'>
							{session?.user?.email}
						</p>
					</div>

					<Link href='/dashboard'>
						<div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
							Dashboard
						</div>
					</Link>
					<Link href='/dashboard/post-job'>
						<div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
							Post New Job
						</div>
					</Link>

					<Link href='/dashboard/company-profile'>
						<div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
							Company Profile
						</div>
					</Link>

					<Link href='/dashboard/view-jobs'>
						<div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
							Job Submissions
						</div>
					</Link>
					<button
						onClick={handleSignOut}
						className='w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600'>
						Logout
					</button>
				</div>
			)}
		</div>
	);
};

export default PostJobDropdown;
