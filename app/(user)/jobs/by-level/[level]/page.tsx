import { Metadata } from "next";
import { getJobLevels, getJobsByLevelPaginated } from "@/sanity/lib/queries";
import Pagination from "@/components/PaginationComponent";
import { notFound } from "next/navigation";
import AsideMain from "@/components/sidebar/AsideMain";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types/types";
import JobCardCategories from "@/components/JobCardCategories";
import Link from "next/link";

type Props = {
	params: Promise<{ level: string }>;
	searchParams: Promise<{ page?: string }>;
};

type JobLevelData = {
	_id: string;
	slug: string;
	name: string;
	jobCount?: number;
};

// Revalidate every hour for better performance
export const revalidate = 3600;

export async function generateStaticParams() {
	const jobLevels: JobLevelData[] = await getJobLevels();
	return jobLevels
		.filter((jobLevel) => jobLevel.slug)
		.map((jobLevel) => ({
			level: jobLevel.slug,
		}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { level } = await params;
	const jobLevels = await getJobLevels();
	const jobLevelData = jobLevels.find(
		(jobLevel: JobLevelData) => jobLevel.slug === level,
	);

	if (!jobLevelData) return { title: "Job level not found" };

	return {
		title: `${jobLevelData.name} Jobs in Nigeria | Latest Openings`,
		description: `Find the latest ${jobLevelData.name} job vacancies and career opportunities in Nigeria. Browse ${jobLevelData.jobCount || 0} ${jobLevelData.name} job listings.`,
		keywords: `${jobLevelData.name} jobs, ${jobLevelData.name} positions in Nigeria, ${jobLevelData.name} vacancies, ${jobLevelData.name} opportunities`,
		openGraph: {
			title: `${jobLevelData.name} Jobs in Nigeria | Latest Openings`,
			description: `Find the latest ${jobLevelData.name} job vacancies in Nigeria.`,
			type: "website",
		},
	};
}

export default async function JobLevelJobsPage({
	params,
	searchParams,
}: Props) {
	const { level } = await params;
	const { page } = await searchParams;
	const currentPage = Number(page) || 1;
	const perPage = 10;

	// Validate level parameter
	if (!level || level === "null") {
		return notFound();
	}

	const jobLevels: JobLevelData[] = await getJobLevels();
	const jobLevelData = jobLevels.find(
		(jobLevel: JobLevelData) => jobLevel.slug === level,
	);

	if (!jobLevelData) {
		return notFound();
	}

	// Get paginated jobs for better performance
	const { jobs, totalCount } = await getJobsByLevelPaginated(
		level,
		currentPage,
		perPage,
	);

	return (
		<SubLayout
			aside={
				<div className='hidden md:block'>
					<AsideMain />
				</div>
			}>
			<div className='page-container'>
				<h1 className='page-h1'>
					{jobLevelData.name} Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {totalCount}{" "}
						{jobLevelData.name.toLowerCase()}{" "}
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
					<div className='py-12 text-center font-saira'>
						<h2 className='text-base font-semibold md:text-lg'>
							No{" "}
							{jobLevelData.name.toLowerCase()}{" "}
							jobs currently available
						</h2>
						<Link
							href='/jobs/by-level'
							className=''>
							<button className='px-4 py-2 mt-2 text-sm font-medium underline transition-colors text-pry2 md:text-base hover:text-pry'>
								Browse all job
								levels
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
