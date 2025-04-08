import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import placeholder from "@/public/placeholderCompany.png";

type CompanyWithJobCount = {
	_id: string;
	name: string;
	slug: { current: string };
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
    slug,
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
		<div className='bg-white p-4 rounded-lg shadow'>
			<h3 className='text-lg font-bold mb-4 font-poppins'>
				Top Companies
			</h3>

			{topCompanies.length === 0 ? (
				<p className='text-gray-500 text-sm'>
					No companies found
				</p>
			) : (
				<ul className='space-y-3 font-openSans'>
					{topCompanies.map((company) => (
						<li
							key={company._id}
							className='flex items-center gap-2'>
							<div className='h-8 w-8 rounded-full overflow-hidden flex-shrink-0'>
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
								href={`/companies/${company.slug.current}`}
								className='text-sm font-medium hover:text-blue-600 transition-colors flex-grow'>
								{company.name}
							</Link>

							<span className='text-xs px-2 py-1 bg-gray-100 rounded-md text-center'>
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
