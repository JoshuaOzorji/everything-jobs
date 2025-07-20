// import { Metadata } from "next";
// import { client } from "@/sanity/lib/client";
// import { Job, RelatedJob } from "@/types/types";
// import SubLayout from "@/components/SubLayout";
// import AsideMain from "@/components/sidebar/AsideMain";
// import placeholder from "@/public/placeholderCompany.png";
// import { urlForImage } from "@/sanity/lib/image";
// import { jobQuery, relatedJobsQuery } from "@/sanity/lib/queries";
// import JobPageContent from "@/components/Job/JobPageContent";

// type PageProps = {
// 	params: Promise<{
// 		slug: string;
// 	}>;
// };

// export const revalidate = 3600;

// export async function generateMetadata({
// 	params,
// }: PageProps): Promise<Metadata> {
// 	const resolvedParams = await params;
// 	const slug = resolvedParams.slug;
// 	const job: Job | null = await client.fetch(jobQuery, { slug });

// 	return {
// 		title: job
// 			? `${job.title} at ${job.company.name} | Everything Jobs`
// 			: "Job Details | Everything Jobs",
// 		description:
// 			"Find your next career opportunity with detailed job listings across Nigeria",
// 		keywords: "jobs in Nigeria, career opportunities, employment, job search, job listings, Nigerian jobs, job vacancies",
// 	};
// }

// export async function generateStaticParams() {
// 	const jobs = await client.fetch(
// 		`*[_type == "job" && _createdAt > now() - 60*60*24*30][0...50]{ "slug": slug.current }`,
// 	);
// 	return jobs.map((job: { slug: string }) => ({ slug: job.slug }));
// }

// export default async function JobPage({ params }: PageProps) {
// 	const resolvedParams = await params;
// 	const { slug } = resolvedParams;
// 	const job: Job | null = await client.fetch(jobQuery, { slug });

// 	if (!job) {
// 		return <div>Job not found.</div>;
// 	}

// 	// Fix: Pass null instead of empty strings for missing IDs
// 	const relatedJobs: RelatedJob[] = await client.fetch(relatedJobsQuery, {
// 		currentJobId: job._id,
// 		jobFieldId: job.jobFieldId || null,
// 		jobTypeId: job.jobTypeId || null,
// 		levelId: job.levelId || null,
// 		educationId: job.educationId || null,
// 		locationId: job.locationId || null,
// 	});

// 	const imageUrl = job.company.logo?.asset?._ref
// 		? urlForImage(job.company.logo).url()
// 		: placeholder.src;

// 	return (
// 		<SubLayout
// 			aside={
// 				<div className='hidden md:block'>
// 					<AsideMain />
// 				</div>
// 			}>
// 			<JobPageContent
// 				job={job}
// 				imageUrl={imageUrl}
// 				relatedJobs={relatedJobs}
// 			/>
// 		</SubLayout>
// 	);
// }

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

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "An unknown error occurred";
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	const slug = resolvedParams.slug;

	try {
		const job: Job | null = await client.fetch(jobQuery, { slug });
		return {
			title: job
				? `${job.title} at ${job.company.name} | Everything Jobs`
				: "Job Details | Everything Jobs",
			description:
				"Find your next career opportunity with detailed job listings across Nigeria",
			keywords: "jobs in Nigeria, career opportunities, employment, job search, job listings, Nigerian jobs, job vacancies",
		};
	} catch (error) {
		console.error(
			"Error in generateMetadata:",
			getErrorMessage(error),
		);
		return {
			title: "Job Details | Everything Jobs",
			description:
				"Find your next career opportunity with detailed job listings across Nigeria",
		};
	}
}

// export async function generateStaticParams() {
// 	try {
// 		const jobs = await client.fetch(
// 			`*[_type == "job" && _createdAt > now() - 60*60*24*30][0...50]{ "slug": slug.current }`,
// 		);
// 		return jobs.map((job: { slug: string }) => ({
// 			slug: job.slug,
// 		}));
// 	} catch (error) {
// 		console.error(
// 			"Error in generateStaticParams:",
// 			getErrorMessage(error),
// 		);
// 		return [];
// 	}
// }

export default async function JobPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { slug } = resolvedParams;

	console.log("JobPage: Processing slug:", slug);

	let job: Job | null = null;
	try {
		job = await client.fetch(jobQuery, { slug });
		console.log("JobPage: Job fetched successfully", job?._id);
	} catch (error) {
		console.error("JobPage: Error fetching job:", error);
		throw new Error(
			`Failed to fetch job: ${getErrorMessage(error)}`,
		);
	}

	if (!job) {
		console.log("JobPage: Job not found for slug:", slug);
		return <div>Job not found.</div>;
	}

	console.log("JobPage: Job data:", {
		id: job._id,
		jobFieldId: job.jobFieldId,
		jobTypeId: job.jobTypeId,
		levelId: job.levelId,
		educationId: job.educationId,
		locationId: job.locationId,
	});

	let relatedJobs: RelatedJob[] = [];
	try {
		const queryParams = {
			currentJobId: job._id,
			jobFieldId: job.jobFieldId || null,
			jobTypeId: job.jobTypeId || null,
			levelId: job.levelId || null,
			educationId: job.educationId || null,
			locationId: job.locationId || null,
		};

		console.log("JobPage: Related jobs query params:", queryParams);

		relatedJobs = await client.fetch(relatedJobsQuery, queryParams);
		console.log(
			"JobPage: Related jobs fetched successfully, count:",
			relatedJobs.length,
		);
	} catch (error) {
		console.error(
			"JobPage: Error fetching related jobs:",
			getErrorMessage(error),
		);
		// Don't throw here, just log and continue with empty array
		relatedJobs = [];
	}

	let imageUrl = placeholder.src;
	try {
		if (job.company.logo?.asset?._ref) {
			imageUrl = urlForImage(job.company.logo).url();
		}
	} catch (error) {
		console.error(
			"JobPage: Error processing company logo:",
			getErrorMessage(error),
		);
		// Continue with placeholder
	}

	console.log("JobPage: Rendering page for job:", job.title);

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
