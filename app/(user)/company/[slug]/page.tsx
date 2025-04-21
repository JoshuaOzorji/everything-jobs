// import { groq } from "next-sanity";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import Link from "next/link";
// import { urlFor } from "@/sanity/lib/image";
// import { notFound } from "next/navigation";
// import { Company, Job, PaginatedCompanyData } from "@/types";
// import SubLayout from "@/components/SubLayout";
// import CompanyDetailsAside from "@/components/CompanyDetailsAside";
// import { FaArrowLeft } from "react-icons/fa6";
// import ExpandableDescription from "@/components/ExpandableDescription";
// import CompanyJobCard from "@/components/CompanyJobCard";
// import placeholder from "@/public/placeholderCompany.png";
// import { RxExternalLink } from "react-icons/rx";
// import Pagination from "@/components/PaginationComponent";

// export async function generateStaticParams() {
// 	const query = groq`*[_type == "company"][0...10].slug.current`;
// 	const slugs = await client.fetch<string[]>(query);
// 	return slugs.map((slug) => ({ slug }));
// }

// // Company base query
// const companyBaseQuery = groq`
//   *[_type == "company" && slug.current == $slug][0] {
//     _id,
//     name,
//     logo {
//       asset->,
//       alt
//     },
//     description,
//     slug,
//     website,
//     industry-> { name, slug },
//     "totalJobs": count(*[_type == "job" && references(^._id)])
//   }
// `;

// // Jobs pagination query
// const jobsQuery = groq`
//   *[_type == "job" && references($companyId)] | order(publishedAt desc) [$start...$end] {
//     _id,
//     title,
//     summary,
//     slug,
//     publishedAt,
//     deadline,
//     jobType->{name},
//     location->{
//       name,
//       slug
//     },
//     level->{name}
//   }
// `;
// // Additional jobs info query needed for the aside
// const companyJobsInfoQuery = groq`
//   *[_type == "job" && references($companyId)] {
//     _id,
//     title,
//     slug,
//     publishedAt,
//     deadline
//   }
// `;

// async function getCompanyWithPaginatedJobs(
// 	slug: string,
// 	page: number = 1,
// 	perPage: number = 3,
// ): Promise<PaginatedCompanyData | null> {
// 	// First fetch the company details
// 	const company = await client.fetch<Company & { totalJobs: number }>(
// 		companyBaseQuery,
// 		{ slug },
// 	);

// 	if (!company) {
// 		return null;
// 	}

// 	// Then fetch the paginated jobs
// 	const start = (page - 1) * perPage;
// 	const end = start + perPage;

// 	const jobs = await client.fetch<Job[]>(jobsQuery, {
// 		companyId: company._id,
// 		start,
// 		end,
// 	});

// 	return {
// 		...company,
// 		jobs,
// 		pagination: {
// 			currentPage: page,
// 			total: company.totalJobs,
// 			perPage,
// 		},
// 	};
// }

// export default async function CompanyDetailPage({
// 	params,
// 	searchParams,
// }: {
// 	params: { slug: string };
// 	searchParams: { page?: string };
// }) {
// 	const { slug } = params;
// 	const page = searchParams.page ? parseInt(searchParams.page) : 1;
// 	const perPage = 3; // Number of jobs per page

// 	const companyData = await getCompanyWithPaginatedJobs(
// 		slug,
// 		page,
// 		perPage,
// 	);

// 	if (!companyData) {
// 		notFound();
// 	}

// 	const { jobs, pagination, ...company } = companyData;

// 	return (
// 		<SubLayout aside={<CompanyDetailsAside company={company} />}>
// 			<div className='font-openSans'>
// 				<Link href='/companies'>
// 					<p className='inline-flex items-center gap-1 mb-4 text-[13px] text-pry2 hover:underline animate md:text-sm'>
// 						<FaArrowLeft />
// 						Back to Companies
// 					</p>
// 				</Link>

// 				<div className='p-4 bg-white rounded-lg shadow-sm md:p-6'>
// 					<div className='flex flex-col gap-2 md:gap-6 md:flex-row md:items-center'>
// 						<div className='flex items-center gap-3'>
// 							<div className='flex items-center justify-center flex-shrink-0 w-[8vh] h-[8vh] md:w-[20vh] md:h-[20vh]'>
// 								{company.logo
// 									?.asset ? (
// 									<Image
// 										src={urlFor(
// 											company.logo,
// 										).url()}
// 										alt={
// 											company
// 												.logo
// 												.alt ||
// 											company.name
// 										}
// 										width={
// 											200
// 										}
// 										height={
// 											200
// 										}
// 										className='object-contain rounded-md max-h-28'
// 									/>
// 								) : (
// 									<Image
// 										src={
// 											placeholder
// 										}
// 										alt={
// 											company.name
// 										}
// 										width={
// 											200
// 										}
// 										height={
// 											200
// 										}
// 										className='object-contain h-full rounded-md max-h-28'
// 									/>
// 								)}
// 							</div>

// 							{/* COMPANY NAME & WEBSITE SMALL SCREEN*/}
// 							<div className='block md:hidden'>
// 								<h1 className='text-lg font-bold md:text-2xl font-poppins'>
// 									{
// 										company.name
// 									}
// 								</h1>
// 								{company.website && (
// 									<a
// 										href={
// 											company.website
// 										}
// 										target='_blank'
// 										rel='noopener noreferrer'
// 										className='flex items-center gap-1 text-sm text-pry2 hover:underline group animate'>
// 										<span>
// 											Visit
// 											website
// 										</span>
// 										<RxExternalLink className='hidden w-4 h-4 group-hover:inline' />
// 									</a>
// 								)}
// 							</div>
// 						</div>

// 						{/* DESCRIPTION */}
// 						<div className='mt-2'>
// 							{/* COMPANY NAME & WEBSITE MD/LG SCREEN*/}
// 							<div className='hidden md:block'>
// 								<h1 className='text-lg font-bold md:text-2xl font-poppins'>
// 									{
// 										company.name
// 									}
// 								</h1>
// 								{company.website && (
// 									<a
// 										href={
// 											company.website
// 										}
// 										target='_blank'
// 										rel='noopener noreferrer'
// 										className='inline-block mb-3 text-sm text-pry2 hover:underline group animate'>
// 										<span>
// 											Visit
// 											website
// 										</span>
// 										<RxExternalLink className='hidden w-4 h-4 group-hover:inline' />
// 									</a>
// 								)}
// 							</div>
// 							{company.description && (
// 								<ExpandableDescription
// 									description={
// 										company.description
// 									}
// 								/>
// 							)}
// 						</div>
// 					</div>
// 				</div>

// 				<h2 className='mt-6 mb-2 text-lg font-bold md:text-xl font-poppins'>
// 					Jobs at {company.name}
// 					{pagination.total > 0 && (
// 						<span className='ml-2 text-sm font-normal text-gray-500'>
// 							({pagination.total}{" "}
// 							{pagination.total === 1
// 								? "job"
// 								: "jobs"}
// 							)
// 						</span>
// 					)}
// 				</h2>

// 				{!jobs || jobs.length === 0 ? (
// 					<div className='p-6 text-center rounded-lg bg-gray-50 font-openSans'>
// 						<p className='text-myBlack'>
// 							No active job listings
// 							for this company
// 						</p>
// 					</div>
// 				) : (
// 					// COMPANY JOB CARDS
// 					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
// 						{jobs.map((job) => (
// 							<div key={job._id}>
// 								<CompanyJobCard
// 									job={
// 										job
// 									}
// 								/>
// 							</div>
// 						))}
// 					</div>
// 				)}

// 				{/* Show pagination if there are multiple pages */}
// 				{pagination.total > pagination.perPage && (
// 					<Pagination
// 						currentPage={
// 							pagination.currentPage
// 						}
// 						total={pagination.total}
// 						perPage={pagination.perPage}
// 					/>
// 				)}
// 			</div>
// 		</SubLayout>
// 	);
// }

// CompanyDetailPage.tsx
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { Company, Job, PaginatedCompanyData } from "@/types";
import SubLayout from "@/components/SubLayout";
import CompanyDetailsAside from "@/components/CompanyDetailsAside";
import { FaArrowLeft } from "react-icons/fa6";
import ExpandableDescription from "@/components/ExpandableDescription";
import CompanyJobCard from "@/components/CompanyJobCard";
import placeholder from "@/public/placeholderCompany.png";
import { RxExternalLink } from "react-icons/rx";
import Pagination from "@/components/PaginationComponent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";

export async function generateStaticParams() {
	const query = groq`*[_type == "company"][0...10].slug.current`;
	const slugs = await client.fetch<string[]>(query);
	return slugs.map((slug) => ({ slug }));
}

// Company base query
const companyBaseQuery = groq`
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
    "totalJobs": count(*[_type == "job" && references(^._id)])
  }
`;

// Jobs pagination query
const jobsQuery = groq`
  *[_type == "job" && references($companyId)] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    summary,
    slug,
    publishedAt,
    deadline,
    jobType->{name},
    location->{
      name,
      slug
    },
    level->{name}
  }
`;

// Additional jobs info query needed for the aside
const companyJobsInfoQuery = groq`
  *[_type == "job" && references($companyId)] {
    _id,
    title,
    slug,
    publishedAt,
    deadline
  }
`;

async function getAllCompanyData(
	slug: string,
	page: number = 1,
	perPage: number = 3,
): Promise<{ companyData: PaginatedCompanyData; jobsInfo: Job[] } | null> {
	// First fetch the company details
	const company = await client.fetch<Company & { totalJobs: number }>(
		companyBaseQuery,
		{ slug },
	);

	if (!company) {
		return null;
	}

	// Fetch paginated jobs and all jobs info in parallel
	const [jobs, jobsInfo] = await Promise.all([
		client.fetch<Job[]>(jobsQuery, {
			companyId: company._id,
			start: (page - 1) * perPage,
			end: (page - 1) * perPage + perPage,
		}),
		client.fetch<Job[]>(companyJobsInfoQuery, {
			companyId: company._id,
		}),
	]);

	return {
		companyData: {
			...company,
			jobs,
			pagination: {
				currentPage: page,
				total: company.totalJobs,
				perPage,
			},
		},
		jobsInfo,
	};
}

// Component for displaying company content
function CompanyContent({
	company,
	jobs,
	pagination,
}: {
	company: Company;
	jobs: Job[];
	pagination: { currentPage: number; total: number; perPage: number };
}) {
	return (
		<div className='font-openSans'>
			<Link href='/companies'>
				<p className='inline-flex items-center gap-1 mb-4 text-[13px] text-pry2 hover:underline animate md:text-sm'>
					<FaArrowLeft />
					Back to Companies
				</p>
			</Link>

			<div className='p-4 bg-white rounded-lg shadow-sm md:p-6'>
				<div className='flex flex-col gap-2 md:gap-6 md:flex-row md:items-center'>
					<div className='flex items-center gap-3'>
						<div className='flex items-center justify-center flex-shrink-0 w-[8vh] h-[8vh] md:w-[20vh] md:h-[20vh]'>
							{company.logo?.asset ? (
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
								{company.name}
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
									<RxExternalLink className='hidden w-4 h-4 group-hover:inline' />
								</a>
							)}
						</div>
					</div>

					{/* DESCRIPTION */}
					<div className='mt-2'>
						{/* COMPANY NAME & WEBSITE MD/LG SCREEN*/}
						<div className='hidden md:block'>
							<h1 className='text-lg font-bold md:text-2xl font-poppins'>
								{company.name}
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
									<RxExternalLink className='hidden w-4 h-4 group-hover:inline' />
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
				{pagination.total > 0 && (
					<span className='ml-2 text-sm font-normal text-gray-500'>
						({pagination.total}{" "}
						{pagination.total === 1
							? "job"
							: "jobs"}
						)
					</span>
				)}
			</h2>

			{!jobs || jobs.length === 0 ? (
				<div className='p-6 text-center rounded-lg bg-gray-50 font-openSans'>
					<p className='text-myBlack'>
						No active job listings for this
						company
					</p>
				</div>
			) : (
				// COMPANY JOB CARDS
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					{jobs.map((job) => (
						<div key={job._id}>
							<CompanyJobCard
								job={job}
							/>
						</div>
					))}
				</div>
			)}

			{/* Show pagination if there are multiple pages */}
			{pagination.total > pagination.perPage && (
				<Pagination
					currentPage={pagination.currentPage}
					total={pagination.total}
					perPage={pagination.perPage}
				/>
			)}
		</div>
	);
}

export default async function CompanyDetailPage({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { page?: string };
}) {
	const { slug } = params;
	const page = searchParams.page ? parseInt(searchParams.page) : 1;
	const perPage = 3; // Number of jobs per page

	const data = await getAllCompanyData(slug, page, perPage);

	if (!data) {
		notFound();
	}

	const { companyData, jobsInfo } = data;
	const { jobs, pagination, ...company } = companyData;

	return (
		<SubLayout
			aside={
				<Suspense fallback={<LoadingComponent />}>
					<CompanyDetailsAside
						company={company}
						jobsInfo={jobsInfo}
					/>
				</Suspense>
			}>
			<Suspense fallback={<LoadingComponent />}>
				<CompanyContent
					company={company}
					jobs={jobs}
					pagination={pagination}
				/>
			</Suspense>
		</SubLayout>
	);
}
