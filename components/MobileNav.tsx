import logo from "@/public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { CgMenu } from "react-icons/cg";
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";

const MobileNav = ({
	toggleSearch,
	isSearchOpen,
}: {
	toggleSearch: () => void;
	isSearchOpen: boolean;
}) => {
	return (
		<nav>
			<div className='flex items-center justify-between p-2'>
				<span>
					<CgMenu className='w-6 h-6' />
				</span>

				<Link href='/'>
					<Image src={logo} alt='logo' />
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
					{/* <Link href='/auth/login'>
						<button className='flex flex-col items-center'>
							<HiMiniUserCircle className='w-4 h-4' />
							<span>Login</span>
						</button>
					</Link> */}
				</div>
			</div>
		</nav>
	);
};

export default MobileNav;
