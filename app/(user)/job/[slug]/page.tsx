import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { Job, RelatedJob } from "@/types/types";
import SubLayout from "@/components/SubLayout";
import AsideMain from "@/components/sidebar/AsideMain";
import placeholder from "@/public/placeholderCompany.png";
import { urlForImage } from "@/sanity/lib/image";
import { jobQuery, relatedJobsQuery } from "@/sanity/lib/queries";
import JobPageContent from "@/components/Job/JobPageContent";

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export const revalidate = 3600;

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	const slug = resolvedParams.slug;
	const job: Job | null = await client.fetch(jobQuery, { slug });

	return {
		title: job
			? `${job.title} at ${job.company.name} | Everything Jobs`
			: "Job Details | Everything Jobs",
		description:
			"Find your next career opportunity with detailed job listings across Nigeria",
		keywords: "jobs in Nigeria, career opportunities, employment, job search, job listings, Nigerian jobs, job vacancies",
	};
}

export async function generateStaticParams() {
	const jobs = await client.fetch(
		`*[_type == "job" && _createdAt > now() - 60*60*24*30][0...50]{ "slug": slug.current }`,
	);
	return jobs.map((job: { slug: string }) => ({ slug: job.slug }));
}

export default async function JobPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { slug } = resolvedParams;
	const job: Job | null = await client.fetch(jobQuery, { slug });

	if (!job) {
		return <div>Job not found.</div>;
	}

	// Fix: Pass null instead of empty strings for missing IDs
	const relatedJobs: RelatedJob[] = await client.fetch(relatedJobsQuery, {
		currentJobId: job._id,
		jobFieldId: job.jobFieldId || null,
		jobTypeId: job.jobTypeId || null,
		levelId: job.levelId || null,
		educationId: job.educationId || null,
		locationId: job.locationId || null,
	});

	const imageUrl = job.company.logo?.asset?._ref
		? urlForImage(job.company.logo).url()
		: placeholder.src;

	return (
		<SubLayout
			aside={
				<div className='hidden md:block'>
					<AsideMain />
				</div>
			}>
			<JobPageContent
				job={job}
				imageUrl={imageUrl}
				relatedJobs={relatedJobs}
			/>
		</SubLayout>
	);
}
