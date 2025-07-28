import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import placeholder from "@/public/placeholderCompany.png";

type CompanyWithJobCount = {
	_id: string;
	name: string;
	slug: string;
	logo?: {
		asset: {
			url: string;
		};
		alt?: string;
	};
	jobCount: number;
};

const topCompaniesQuery = groq`
  *[_type == "company"] {
    _id,
    name,
    "slug": slug.current,
    logo {
      asset->{url},
      alt
    },
    "jobCount": count(*[_type == "job" && references(^._id)])
  } | order(jobCount desc) [0...10]
`;

async function getTopCompanies() {
	return await client.fetch<CompanyWithJobCount[]>(topCompaniesQuery);
}

const CompaniesAside = async () => {
	const topCompanies = await getTopCompanies();

	return (
		<div className='p-4 bg-white rounded-lg shadow-sm md:px-6'>
			<h3 className='mb-4 text-lg font-bold font-poppins'>
				Top Companies Hiring
			</h3>

			{topCompanies.length === 0 ? (
				<p className='text-sm text-gray-500'>
					No companies found
				</p>
			) : (
				<ul className='space-y-3 font-saira'>
					{topCompanies.map((company) => (
						<li
							key={company._id}
							className='flex items-center gap-2'>
							<div className='flex-shrink-0 w-8 h-8 overflow-hidden rounded-full'>
								{company.logo
									?.asset ? (
									<Image
										src={
											company
												.logo
												.asset
												.url
										}
										alt={
											company
												.logo
												.alt ||
											company.name
										}
										width={
											32
										}
										height={
											32
										}
										className='object-cover'
									/>
								) : (
									<Image
										src={
											placeholder
										}
										alt={
											company.name
										}
										width={
											32
										}
										height={
											32
										}
										className='object-cover'
									/>
								)}
							</div>

							<Link
								href={`/company/${company?.slug}`}
								className='flex-grow min-w-0 truncate text-sm font-medium transition-colors hover:text-blue-600'>
								{company.name}
							</Link>

							<span className='flex-shrink-0 px-2 py-1 text-xs text-center bg-gray-100 rounded-md'>
								{
									company.jobCount
								}{" "}
								{company.jobCount ===
								1
									? "job"
									: "jobs"}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CompaniesAside;
