import { Metadata } from "next";
import { getJobFields, getJobsByField } from "@/sanity/lib/queries";
import Pagination from "@/components/PaginationComponent";
import { notFound } from "next/navigation";
import AsideMain from "@/components/sidebar/AsideMain";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";
import Link from "next/link";

type Params = {
	params: Promise<{ field: string }>;
};

type SearchParams = {
	page?: string;
};

type JobFieldType = {
	slug: string;
	name: string;
	jobCount?: number;
	displayName?: string;
};

export async function generateStaticParams() {
	const jobFields: JobFieldType[] = await getJobFields();
	return jobFields
		.filter((field) => field.slug)
		.map((field) => ({
			field: field.slug,
		}));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { field: fieldSlug } = await params;
	const jobFields = await getJobFields();
	const fieldData = jobFields.find(
		(f: JobFieldType) => f.slug === fieldSlug,
	);

	if (!fieldData) return { title: "Job Field not found" };

	return {
		title: `${fieldData.displayName} Jobs in Nigeria | Latest Openings`,
		description: `Find the latest job vacancies and career opportunities in ${fieldData.displayName}. Browse ${fieldData.jobCount || 0} job listings in this field.`,
		keywords: `${fieldData.displayName} jobs, jobs in ${fieldData.displayName}, ${fieldData.displayName} career opportunities, Nigeria ${fieldData.displayName} jobs`,
		openGraph: {
			title: `${fieldData.displayName} Jobs in Nigeria | Latest Openings`,
			description: `Find the latest job vacancies in ${fieldData.displayName} across Nigeria.`,
			type: "website",
		},
	};
}

export default async function JobsByFieldPage({
	params,
	searchParams,
}: {
	params: Promise<{ field: string }>;
	searchParams: Promise<SearchParams>;
}) {
	const { field: fieldSlug } = await params;
	const resolvedSearchParams = await searchParams;

	// Validate field parameter
	if (!fieldSlug || fieldSlug === "null") {
		return notFound();
	}

	// Convert page to number, default to 1
	const currentPage = resolvedSearchParams?.page
		? parseInt(resolvedSearchParams.page, 10)
		: 1;
	const perPage = 10;

	const jobFields: JobFieldType[] = await getJobFields();
	const fieldData = jobFields.find(
		(jobField: JobFieldType) => jobField.slug === fieldSlug,
	);
	if (!fieldData) {
		return notFound();
	}

	const { jobs, totalCount } = await getJobsByField(
		fieldSlug,
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
					{fieldData.displayName ||
						fieldData.name}{" "}
					Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {totalCount} job
						opportunities in{" "}
						{fieldData.displayName}. Find
						your next career opportunity in
						this field.
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
							No jobs currently
							available for{" "}
							{fieldData.displayName}
						</h2>
						<Link
							href='/jobs/by-field'
							className=''>
							<button className='px-4 py-2 mt-2 text-sm font-medium underline transition-colors text-pry2 md:text-base hover:text-pry'>
								Browse all jobs
								in other fields
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
