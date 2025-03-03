import logo from "@/public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { CgMenu } from "react-icons/cg";
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";

const MobileNav = ({
	setIsSearchOpen,
}: {
	setIsSearchOpen: (value: boolean) => void;
}) => {
	return (
		<div>
			<div className='flex items-center justify-between p-2'>
				<span>
					<CgMenu className='w-6 h-6' />
				</span>

				<Link href='/'>
					<Image src={logo} alt='logo' />
				</Link>

				<div className='flex items-center gap-4'>
					<button
						onClick={() =>
							setIsSearchOpen(true)
						}>
						<IoSearchOutline className='w-6 h-6' />
					</button>
					<Link href='/auth/login'>
						<button className='flex flex-col items-center'>
							<HiMiniUserCircle className='w-4 h-4' />
							<span>Login</span>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MobileNav;
