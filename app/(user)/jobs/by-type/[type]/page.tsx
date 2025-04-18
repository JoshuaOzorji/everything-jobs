import { Metadata } from "next";
import { getJobTypes, getJobsByTypePaginated } from "@/sanity/lib/queries";
import Pagination from "@/components/PaginationComponent";
import { notFound } from "next/navigation";
import AsideMain from "@/components/sidebar/AsideMain";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";
import Link from "next/link";

type Props = {
	params: Promise<{ type: string }>;
	searchParams: Promise<{ page?: string }>;
};

type JobTypeData = {
	_id: string;
	slug: string;
	name: string;
	jobCount?: number;
};

// Revalidate every hour for better performance
export const revalidate = 3600;

export async function generateStaticParams() {
	const jobTypes: JobTypeData[] = await getJobTypes();
	return jobTypes
		.filter((jobType) => jobType.slug)
		.map((jobType) => ({
			type: jobType.slug,
		}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { type } = await params;
	const jobTypes = await getJobTypes();
	const jobTypeData = jobTypes.find(
		(jobType: JobTypeData) => jobType.slug === type,
	);

	if (!jobTypeData) return { title: "Job type not found" };

	return {
		title: `${jobTypeData.name} Jobs in Nigeria | Latest Openings`,
		description: `Find the latest ${jobTypeData.name} job vacancies and career opportunities in Nigeria. Browse ${jobTypeData.jobCount || 0} ${jobTypeData.name} job listings.`,
		keywords: `${jobTypeData.name} jobs, ${jobTypeData.name} employment in Nigeria, ${jobTypeData.name} vacancies, ${jobTypeData.name} opportunities`,
		openGraph: {
			title: `${jobTypeData.name} Jobs in Nigeria | Latest Openings`,
			description: `Find the latest ${jobTypeData.name} job vacancies in Nigeria.`,
			type: "website",
		},
	};
}

export default async function JobTypeJobsPage({ params, searchParams }: Props) {
	const { type } = await params;
	const { page } = await searchParams;
	const currentPage = Number(page) || 1;
	const perPage = 10;

	// Validate type parameter
	if (!type || type === "null") {
		return notFound();
	}

	const jobTypes: JobTypeData[] = await getJobTypes();
	const jobTypeData = jobTypes.find(
		(jobType: JobTypeData) => jobType.slug === type,
	);

	if (!jobTypeData) {
		return notFound();
	}

	// Get paginated jobs for better performance
	const { jobs, totalCount } = await getJobsByTypePaginated(
		type,
		currentPage,
		perPage,
	);

	return (
		<SubLayout aside={<AsideMain />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					{jobTypeData.name} Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {totalCount}{" "}
						{jobTypeData.name.toLowerCase()}{" "}
						job opportunities in Nigeria.
						Find your next career
						opportunity.
					</p>
				</div>

				{jobs.length > 0 ? (
					<div className='flex flex-col gap-2'>
						{jobs.map((job: Job) => (
							<JobCardCategories
								key={job._id}
								job={{
									...job,
									slug: job
										.slug
										.current,
								}}
							/>
						))}
					</div>
				) : (
					<div className='py-12 text-center font-openSans'>
						<h2 className='text-base font-semibold md:text-lg'>
							No{" "}
							{jobTypeData.name.toLowerCase()}{" "}
							jobs currently available
						</h2>
						<Link
							href='/jobs/by-type'
							className=''>
							<button className='px-4 py-2 mt-2 text-sm font-medium underline transition-colors text-pry2 md:text-base hover:text-pry'>
								Browse all job
								types
							</button>
						</Link>
					</div>
				)}

				{totalCount > perPage && (
					<Pagination
						currentPage={currentPage}
						total={totalCount}
						perPage={perPage}
					/>
				)}
			</div>
		</SubLayout>
	);
}
