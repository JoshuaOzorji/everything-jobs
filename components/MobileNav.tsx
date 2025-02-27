import React from "react";
import logo from "@/public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { CgMenu } from "react-icons/cg";
import { HiMiniUserCircle } from "react-icons/hi2";
const MobileNav = () => {
	return (
		<div>
			<div className='flex items-center justify-between p-2'>
				<span>
					<CgMenu className='w-6 h-6' />
				</span>

				<Link href='/'>
					<Image src={logo} alt='logo' />
				</Link>

				<Link href='/auth/login'>
					<button className='flex flex-col items-center'>
						<HiMiniUserCircle className='w-4 h-4' />
						<p>Login</p>
					</button>
				</Link>
			</div>
		</div>
	);
};

export default MobileNav;
