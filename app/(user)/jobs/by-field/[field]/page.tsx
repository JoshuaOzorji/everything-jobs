import { Metadata } from "next";
import { getJobFields, getJobsByField } from "@/sanity/lib/queries";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import AsideComponent from "@/components/AsideComponent";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";

type Params = {
	params: Promise<{ field: string }>;
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

export default async function JobsByFieldPage({ params }: Params) {
	const { field: fieldSlug } = await params;

	// Validate field parameter
	if (!fieldSlug || fieldSlug === "null") {
		return notFound();
	}

	const jobFields: JobFieldType[] = await getJobFields();
	const fieldData = jobFields.find(
		(jobField: JobFieldType) => jobField.slug === fieldSlug,
	);
	if (!fieldData) {
		return notFound();
	}

	const jobs = await getJobsByField(fieldSlug);

	return (
		<SubLayout aside={<AsideComponent />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					{fieldData.displayName ||
						fieldData.name}{" "}
					Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {jobs.length} job
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
					<div className='py-12 text-center'>
						<h2 className='text-xl font-semibold'>
							No jobs currently
							available in{" "}
							{fieldData.displayName}
						</h2>
						<p className='mt-2'>
							Check back later or
							browse jobs in other
							fields.
						</p>
					</div>
				)}

				{jobs.length > 10 && (
					<Pagination total={jobs.length} />
				)}
			</div>
		</SubLayout>
	);
}
