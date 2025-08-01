import Link from "next/link";
import Image from "next/image";
import logoImage from "@/public/mtn-new-logo.jpg";
import { BsFacebook } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";

const CompanyInfo = () => {
	return (
		<div className='lg:col-span-2'>
			<Link href='/' className='inline-block mb-6'>
				<Image
					src={logoImage}
					alt='JobSearch Logo'
					width={50}
					height={50}
					className='h-auto'
					priority
				/>
			</Link>
			<p className='mb-4 text-myBlack footer-p'>
				Find your dream job with our comprehensive job
				search platform. Connect with top employers
				across industries.
			</p>
			<div className='flex space-x-4'>
				<a
					href='#'
					className='transition text-myBlack hover:text-pry'>
					<span className='sr-only'>
						Facebook
					</span>
					<BsFacebook className='w-5 h-5' />
				</a>
				<a
					href='#'
					className='transition text-myBlack hover:text-pry'>
					<span className='sr-only'>Twitter</span>
					<RiTwitterXFill className='w-5 h-5' />
				</a>
				<a
					href='#'
					className='transition text-myBlack hover:text-pry'>
					<span className='sr-only'>
						LinkedIn
					</span>
					<FaLinkedin className='w-5 h-5' />
				</a>
			</div>
		</div>
	);
};

export default CompanyInfo;
