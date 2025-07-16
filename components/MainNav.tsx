import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.png";
import { IoSearchOutline } from "react-icons/io5";
import FindJobsDropdown from "./FindJobsDropdown";
import { useSession } from "next-auth/react";
import { useEnhancedSession } from "./AuthProvider";
import PostJobDropdown from "./PostJobDropdown";

interface MainNavProps {
	toggleSearch: () => void;
	isSearchOpen: boolean;
}

const MainNav = ({ toggleSearch, isSearchOpen }: MainNavProps) => {
	const { data: session, status } = useSession();
	const { initialSession, hasCompany } = useEnhancedSession();

	// Use enhanced session data
	const currentSession = session || initialSession;
	const isAuthenticated = !!currentSession?.user;
	const isLoading = status === "loading" && !initialSession;

	return (
		<nav className='border-b font-poppins border-white'>
			<div className='flex items-center justify-between w-[96%] mx-auto py-4 px-2 text-base'>
				<Link href='/'>
					<Image src={logo} alt='logo' />
				</Link>

				<div className='flex items-center gap-5'>
					<div className='flex gap-6'>
						<Link href='/'>
							<FindJobsDropdown />
						</Link>
						<Link href='/remote-jobs'>
							<span className='hover:text-pry animate'>
								Remote Jobs
							</span>
						</Link>
						<Link href='/companies'>
							<span className='hover:text-pry animate'>
								Find Company
							</span>
						</Link>
					</div>
				</div>

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

					{isLoading ? (
						<div className='flex items-center justify-center w-[72px] h-[40px]'>
							<div className='w-4 h-4 border-2 border-gray-300 border-t-pry rounded-full animate-spin'></div>
						</div>
					) : isAuthenticated ? (
						<PostJobDropdown />
					) : (
						<Link href='/dashboard/post-job'>
							<button className='flex flex-col items-center px-2 py-1 text-white rounded-md bg-pry'>
								<p>Post Job</p>
							</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default MainNav;
