"use client";

import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

const Header = () => {
	return (
		<main className='bg-white animate'>
			<div className='md:hidden'>
				<MobileNav />
			</div>
			<div className='hidden md:block'>
				<MainNav />
			</div>
		</main>
	);
};

export default Header;
