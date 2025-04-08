import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Company } from "@/types";
import placeholder from "@/public/placeholderCompany.png";

type CompanyCardProps = {
	company: Company;
};

const SmallScreenCompanyCard = ({ company }: CompanyCardProps) => {
	return (
		<div className='block w-full'>
			<div className='flex flex-row items-center w-full gap-2 p-2 bg-white border rounded-lg shadow-sm hover:shadow-md font-poppins'>
				<div className='flex items-center justify-center rounded w-10 h-10'>
					{company.logo ? (
						<Image
							src={urlFor(
								company.logo,
							)
								.width(50)
								.height(50)
								.url()}
							alt={
								company.logo
									.alt ||
								company.name
							}
							width={50}
							height={50}
							className='object-cover rounded-md'
						/>
					) : (
						<Image
							src={placeholder}
							alt={company.name}
							width={50}
							height={50}
							className='object-cover rounded-md'
						/>
					)}
				</div>

				<Link href={`/company/${company.slug.current}`}>
					<h3 className='flex-1 text-[0.9rem] hover:underline'>
						{company.name}
					</h3>
				</Link>
			</div>
		</div>
	);
};

const LargeScreenCompanyCard = ({ company }: CompanyCardProps) => {
	return (
		<div className='flex flex-col h-full p-2 bg-white border rounded-lg shadow-sm hover:shadow-md font-poppins'>
			<div className='flex flex-col items-center justify-center mb-2'>
				{company.logo ? (
					<Image
						src={urlFor(company.logo)
							.width(200)
							.height(100)
							.url()}
						alt={
							company.logo.alt ||
							company.name
						}
						width={200}
						height={100}
						className='object-contain rounded-md max-h-24 w-full aspect-[2/1]'
					/>
				) : (
					<div className='flex items-center justify-center w-full h-full rounded'>
						<Image
							src={placeholder}
							alt={company.name}
							width={200}
							height={100}
							className='object-contain rounded-md max-h-24 w-full aspect-[2/1]'
						/>
					</div>
				)}
			</div>

			<div className='relative group'>
				<div className='mb-2 text-sm text-center truncate hover:underline'>
					<Link
						href={`/company/${company.slug.current}`}>
						{company.name}
					</Link>
				</div>
				<span className='absolute max-w-xs px-2 py-1 mb-1 text-xs text-white transition-opacity -translate-x-1/2 rounded-md opacity-0 left-1/2 bottom-full w-max bg-myBlack group-hover:opacity-100'>
					{company.name}
				</span>
			</div>
		</div>
	);
};

const CompanyCard = ({ company }: CompanyCardProps) => {
	return (
		<>
			<div className='flex md:hidden'>
				<SmallScreenCompanyCard company={company} />
			</div>
			<div className='hidden md:flex md:flex-col'>
				<LargeScreenCompanyCard company={company} />
			</div>
		</>
	);
};

export default CompanyCard;
