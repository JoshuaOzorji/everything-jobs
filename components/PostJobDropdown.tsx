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

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/" });
	};

	// Get user initials from name
	const getInitials = (name: string | null | undefined) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = getInitials(session?.user?.name);

	return (
		<div className='relative font-poppins' ref={dropdownRef}>
			<button
				className='flex items-center justify-center w-9 h-9 rounded-full bg-pry text-white hover:bg-pry/90 transition-colors'
				onClick={() => setIsOpen(!isOpen)}>
				<span className='text-sm md:text-base font-bold'>
					{userInitials}
				</span>
			</button>

			{isOpen && (
				<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border'>
					<Link href='/dashboard'>
						<div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
							Dashboard
						</div>
					</Link>
					<Link href='/post-job'>
						<div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
							Post Job
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
