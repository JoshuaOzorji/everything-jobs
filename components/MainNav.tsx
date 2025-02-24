import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.png";
import { navItems } from "@/lib/data";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BsBriefcaseFill } from "react-icons/bs";

const MainNav = () => {
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

				<div className='flex gap-4 text-xl items-center'>
					<Link href='/auth/signup'>
						<button className='border text-white bg-pry py-1 px-2 rounded-lg'>
							<BsBriefcaseFill />
							<p>Post Job</p>
						</button>
					</Link>
					<Link href='/auth/login'>
						<button className=''>
							<HiMiniUserCircle />
							<p>Login</p>
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default MainNav;
