import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { Company } from "@/types";
import SubLayout from "@/components/SubLayout";
import CompanyDetailsAside from "@/components/CompanyDetailsAside";
import { FaArrowLeft } from "react-icons/fa6";
import ExpandableDescription from "@/components/ExpandableDescription";
import CompanyJobCard from "@/components/CompanyJobCard";
import placeholder from "@/public/placeholderCompany.png";
import { RxExternalLink } from "react-icons/rx";

// Generate static params for commonly accessed companies
export async function generateStaticParams() {
	const query = groq`*[_type == "company"][0...10].slug.current`;
	const slugs = await client.fetch<string[]>(query);
	return slugs.map((slug) => ({ slug }));
}

// Company query with related jobs
const companyQuery = groq`
  *[_type == "company" && slug.current == $slug][0] {
    _id,
    name,
    logo {
      asset->,
      alt
    },
    description,
    slug,
    website,
		industry-> { name, slug },
    "jobs": *[_type == "job" && references(^._id)] {
      _id,
      title,
      summary,
      slug,
      publishedAt,
      deadline,
      jobType->{name},
      location->{
			name,
			states,
			slug
		},	
      level->{name}
    },
  }
`;

async function getCompany(slug: string) {
	return await client.fetch<Company>(companyQuery, { slug });
}

export default async function CompanyDetailPage({
	params,
}: {
	params: { slug: string };
}) {
	const company = await getCompany(params.slug);

	if (!company) {
		notFound();
	}

	return (
		<SubLayout aside={<CompanyDetailsAside company={company} />}>
			<div className='font-openSans'>
				<Link href='/companies'>
					<p className='inline-flex items-center gap-1 mb-6 text-[13px] text-pry2 hover:underline animate md:text-sm'>
						<FaArrowLeft />
						Back to Companies
					</p>
				</Link>

				<div className='p-4 bg-white rounded-lg shadow-sm md:p-6'>
					<div className='flex flex-col gap-2 md:gap-6 md:flex-row md:items-center'>
						<div className='flex items-center gap-3'>
							<div className='flex items-center justify-center flex-shrink-0 w-[8vh] h-[8vh] md:w-[20vh] md:h-[20vh]'>
								{company.logo
									?.asset ? (
									<Image
										src={urlFor(
											company.logo,
										).url()}
										alt={
											company
												.logo
												.alt ||
											company.name
										}
										width={
											200
										}
										height={
											200
										}
										className='object-contain rounded-md max-h-28'
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
											200
										}
										height={
											200
										}
										className='object-contain h-full rounded-md max-h-28'
									/>
								)}
							</div>

							{/* COMPANY NAME & WEBSITE SMALL SCREEN*/}
							<div className='block md:hidden'>
								<h1 className='text-lg font-bold md:text-2xl font-poppins'>
									{
										company.name
									}
								</h1>
								{company.website && (
									<a
										href={
											company.website
										}
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center gap-1 text-sm text-pry2 hover:underline group animate'>
										<span>
											Visit
											website
										</span>
										<RxExternalLink className='hidden w-4 h-4 group-hover:inline ' />
									</a>
								)}
							</div>
						</div>

						{/* DESCRIPTION */}
						<div className='mt-2'>
							{/* COMPANY NAME & WEBSITE MD/LG SCREEN*/}
							<div className='hidden md:block'>
								<h1 className='text-lg font-bold md:text-2xl font-poppins'>
									{
										company.name
									}
								</h1>
								{company.website && (
									<a
										href={
											company.website
										}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-block mb-3 text-sm text-pry2 hover:underline group animate'>
										<span>
											Visit
											website
										</span>
										<RxExternalLink className='hidden w-4 h-4 group-hover:inline ' />
									</a>
								)}
							</div>
							{company.description && (
								<ExpandableDescription
									description={
										company.description
									}
								/>
							)}
						</div>
					</div>
				</div>

				<h2 className='mt-6 mb-2 text-lg font-bold md:text-xl font-poppins'>
					Jobs at {company.name}
				</h2>

				{!company.jobs || company.jobs.length === 0 ? (
					<div className='p-6 text-center rounded-lg bg-gray-50 font-openSans'>
						<p className='text-myBlack'>
							No active job listings
							for this company
						</p>
					</div>
				) : (
					// COMPANY JOB CARD
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						{company.jobs.map((job) => (
							<div key={job._id}>
								<CompanyJobCard
									job={
										job
									}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</SubLayout>
	);
}
