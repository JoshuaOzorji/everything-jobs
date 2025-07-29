import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { Job } from "@/types/types";
import SubLayout from "@/components/SubLayout";
import AsideMain from "@/components/sidebar/AsideMain";
import placeholder from "@/public/placeholderCompany.png";
import { urlForImage } from "@/sanity/lib/image";
import { jobQuery, relatedJobsQuery } from "@/sanity/lib/queries";
import JobPageContent from "@/components/Job/JobPageContent";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

// ISR - regenerate every hour
export const revalidate = 3600;

export async function generateStaticParams() {
	try {
		const jobs = await client.fetch(
			`*[_type == "job" && defined(slug.current)][0...20]{ 
				"slug": slug.current 
			}`,
		);

		return jobs
			.filter((job: any) => job?.slug)
			.map((job: { slug: string }) => ({
				slug: job.slug,
			}));
	} catch (error) {
		console.error("generateStaticParams error:", error);
		return [];
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	try {
		const resolvedParams = await params;
		const slug = resolvedParams.slug;

		// Use faster, minimal query for metadata
		const job = await client.fetch(
			`*[_type == "job" && slug.current == $slug][0]{
				title,
				company->{name}
			}`,
			{ slug },
			{ next: { revalidate: 3600 } },
		);

		return {
			title: job
				? `${job.title} at ${job.company.name} | Everything Jobs`
				: "Job Details | Everything Jobs",
			description:
				"Find your next career opportunity with detailed job listings across Nigeria",
			keywords: "jobs in Nigeria, career opportunities, employment, job search, job listings, Nigerian jobs, job vacancies",
		};
	} catch (error) {
		console.error("generateMetadata error:", error);
		return {
			title: "Job Details | Everything Jobs",
			description:
				"Find your next career opportunity with detailed job listings across Nigeria",
		};
	}
}

export default async function JobPage({ params }: PageProps) {
	try {
		const resolvedParams = await params;
		const { slug } = resolvedParams;

		// Main job query with caching
		const job: Job | null = await client.fetch(
			jobQuery,
			{ slug },
			{
				next: {
					revalidate: 3600,
					tags: [`job-${slug}`], // For on-demand revalidation
				},
			},
		);

		if (!job) {
			notFound();
		}

		const relatedJobsPromise = client
			.fetch(
				relatedJobsQuery,
				{
					currentJobId: job._id,
					jobFieldId: job.jobFieldId || null,
					jobTypeId: job.jobTypeId || null,
					levelId: job.levelId || null,
					educationId: job.educationId || null,
					locationId: job.locationId || null,
				},
				{
					next: {
						revalidate: 7200, // Related jobs can be cached longer
					},
				},
			)
			.catch((error) => {
				console.error(
					"Error fetching related jobs:",
					error,
				);
				return [];
			});

		let imageUrl = placeholder.src;
		try {
			if (job.company?.logo?.asset?._ref) {
				imageUrl = urlForImage(job.company.logo).url();
			}
		} catch (error) {
			console.error("Error processing image:", error);
		}

		const relatedJobs = await relatedJobsPromise;

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
	} catch (error) {
		console.error("Critical error in JobPage:", error);

		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h1 className='mb-4 text-2xl font-bold text-gray-900'>
						Something went wrong
					</h1>
					<p className='text-gray-600'>
						Unable to load this job. Please
						try again later.
					</p>
				</div>
			</div>
		);
	}
}
