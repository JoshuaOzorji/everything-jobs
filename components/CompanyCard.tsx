import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Company } from "@/types";

type CompanyCardProps = {
	company: Company;
};

const CompanyCard = ({ company }: CompanyCardProps) => {
	return (
		<Link href={`/companies/${company.slug.current}`}>
			<div className='flex flex-col h-full border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4'>
				<div className='flex items-center justify-center mb-4 h-24'>
					{company.logo ? (
						<Image
							src={urlFor(
								company.logo,
							)
								.width(200)
								.height(100)
								.url()}
							alt={
								company.logo
									.alt ||
								company.name
							}
							width={200}
							height={100}
							className='object-contain max-h-24'
						/>
					) : (
						<div className='w-full h-full flex items-center justify-center bg-gray-100 rounded'>
							<span className='text-gray-500 font-medium text-xl'>
								{company.name.charAt(
									0,
								)}
							</span>
						</div>
					)}
				</div>
				<h3 className='text-lg font-semibold mb-2'>
					{company.name}
				</h3>
				{company.description && (
					<p className='text-gray-600 text-sm line-clamp-3 mb-2'>
						{company.description}
					</p>
				)}
			</div>
		</Link>
	);
};

export default CompanyCard;
