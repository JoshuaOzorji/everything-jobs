import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.png";
import { navItems } from "@/lib/data";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BsBriefcaseFill } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";

const MainNav = ({
	setIsSearchOpen,
}: {
	setIsSearchOpen: (value: boolean) => void;
}) => {
	return (
		<nav className='font-semibold border-b font-markaziText'>
			<div className='flex items-center justify-between w-[96%] mx-auto py-3 px-2'>
				<div className='flex space-x-12'>
					<Link href='/'>
						<Image src={logo} alt='logo' />
					</Link>

					<div className='flex items-center gap-5'>
						<ul className='flex gap-6 text-xl'>
							{navItems.map(
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
												"/"
											}>
											{
												item
											}
										</Link>
									</li>
								),
							)}
						</ul>
					</div>
				</div>

				<div className='flex items-center gap-4 text-xl'>
					<Link href='/auth/signup'>
						<button className='flex flex-col items-center px-2 py-1 text-white rounded-lg bg-pry'>
							<BsBriefcaseFill className='w-3 h-3' />
							<p>Post Job</p>
						</button>
					</Link>

					<div className='flex items-center gap-4'>
						<Link href='/auth/login'>
							<button className='flex flex-col items-center'>
								<HiMiniUserCircle className='w-4 h-4' />
								<span>
									Login
								</span>
							</button>
						</Link>

						<button
							onClick={() =>
								setIsSearchOpen(
									true,
								)
							}>
							<IoSearchOutline className='w-6 h-6' />
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default MainNav;
