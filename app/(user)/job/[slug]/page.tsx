import { Metadata } from "next";
import { lazy, Suspense } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { Job } from "@/types";
import SubLayout from "@/components/SubLayout";
import AsideMain from "@/components/sidebar/AsideMain";
import placeholder from "@/public/placeholderCompany.png";
import { formatDate2 } from "@/lib/formatDate2";
import { ImLocation } from "react-icons/im";
import { IoIosCash } from "react-icons/io";
import { IoBriefcase } from "react-icons/io5";
import { PiBuildingsFill } from "react-icons/pi";
import { RiMedalFill } from "react-icons/ri";
import { LuCalendar1 } from "react-icons/lu";
import { formatDate } from "@/lib/formatDate";
import { RiUserStarFill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { urlForImage } from "@/sanity/lib/image";
import { jobQuery, relatedJobsQuery } from "@/sanity/lib/queries";
import RelatedJobs from "@/components/RelatedJobs";
import { getDisplayNameForEducation } from "@/sanity/lib/utility";
import { getDisplayNameForJobLevel } from "@/sanity/lib/utility";
import { getDisplayNameForJobField } from "@/sanity/lib/utility";

const JobDetails = lazy(() => import("@/components/JobDetails"));

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
	// Pre-render popular job listings
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

	// Fetch related jobs
	const relatedJobs = await client.fetch(relatedJobsQuery, {
		currentJobId: job._id,
		jobFieldId: job.jobFieldId,
		jobTypeId: job.jobTypeId,
		levelId: job.levelId,
		educationId: job.educationId,
		locationId: job.locationId,
	});

	const imageUrl = job.company.logo?.asset?._ref
		? urlForImage(job.company.logo).url()
		: placeholder.src;

	// Function to format the date for the deadline
	function JobDeadline({ deadline }: { deadline?: string }) {
		if (!deadline) return null;

		return (
			<div className='flex justify-center w-full mt-4 font-openSans'>
				<p className='icon-container'>
					{new Date(deadline) > new Date() ? (
						<>
							<span className='text-red-500'>
								Deadline:
							</span>{" "}
							{formatDate2(
								new Date(
									deadline,
								),
							)}
						</>
					) : (
						<span className='text-white bg-red-500 px-2 py-0.5 rounded-md flex items-center gap-1 font-normal'>
							<MdErrorOutline />
							<p>Job Expired</p>
						</span>
					)}
				</p>
			</div>
		);
	}

	// Function to display job metadata like experience, salary, job type, etc.
	function JobMetadata({ job }: { job: Job }) {
		return (
			<>
				{(job.experienceRange?.min != null ||
					job.experienceRange?.max != null) && (
					<p className='icon-container2'>
						<RiMedalFill className='icon' />
						<span>Experience:</span>{" "}
						{job.experienceRange?.min ?? 0}{" "}
						-{" "}
						{job.experienceRange?.max ?? 0}+
						years
					</p>
				)}

				{job.salaryRange?.min &&
					job.salaryRange?.max && (
						<div className='icon-container'>
							<IoIosCash className='icon' />
							<span>Pay:</span>
							<p>
								₦
								{job.salaryRange.min.toLocaleString()}{" "}
								- ₦
								{job.salaryRange.max.toLocaleString()}
							</p>
						</div>
					)}

				<div className='icon-container'>
					<IoBriefcase className='icon' />
					<span>Job-Type:</span>
					<p className='job-input'>
						{job.jobType?.name}
					</p>
				</div>

				<div className='icon-container'>
					<PiBuildingsFill className='icon' />
					<span>Job Field:</span>
					<p className='job-input'>
						{getDisplayNameForJobField(
							job.jobField?.name,
						)}
					</p>
				</div>

				{job.level && (
					<div className='icon-container2'>
						<RiUserStarFill className='icon' />
						<span>Career Levels: </span>
						<p className='job-input'>
							{getDisplayNameForJobLevel(
								job.level?.name,
							)}
						</p>
					</div>
				)}

				{job.education && (
					<div className='icon-container2'>
						<FaGraduationCap className='icon' />
						<span>Qualification:</span>
						<p className='job-input'>
							{getDisplayNameForEducation(
								job.education
									.name,
							)}
						</p>
					</div>
				)}
			</>
		);
	}

	return (
		<SubLayout aside={<AsideMain />}>
			<div className='p-4 bg-white rounded-md font-openSans text-myBlack md:p-8'>
				<section className='pb-4 mb-4 border-b border-zinc-300'>
					{/* Company header - kept in main bundle */}
					<div className='flex items-center justify-between text-sm font-poppins md:text-base'>
						<div className='flex items-center gap-2'>
							<Image
								src={imageUrl}
								alt={
									job
										.company
										.name
								}
								className='h-[7vh] w-[7vh] rounded-sm'
								width={50}
								height={50}
								priority
							/>

							<Link
								href={`/company/${job.company.slug}`}>
								<p className='hover:underline'>
									{
										job
											.company
											.name
									}
								</p>
							</Link>
						</div>

						{job.publishedAt && (
							<p className='flex items-center gap-1'>
								<LuCalendar1 />
								{formatDate(
									new Date(
										job.publishedAt,
									),
								)}
							</p>
						)}
					</div>

					{/* Job title */}
					<h1 className='mt-6 mb-2 text-xl font-bold md:text-3xl font-poppins text-pry'>
						{job.title}
					</h1>

					{/* Basic job info */}
					<div className='space-y-1 font-openSans'>
						<div className='icon-container'>
							<ImLocation className='icon' />
							<span>Location: </span>
							<p>
								{
									job
										.location
										?.name
								}
							</p>
						</div>

						{/* Job metadata fields */}
						<JobMetadata job={job} />

						{/* Deadline */}
						<JobDeadline
							deadline={job.deadline}
						/>
					</div>
				</section>

				{/* Job details with lazy loading */}
				<Suspense
					fallback={
						<div>
							Loading job details...
						</div>
					}>
					<JobDetails job={job} />
				</Suspense>

				{/* Related Jobs section */}
				{relatedJobs && relatedJobs.length > 0 && (
					<RelatedJobs jobs={relatedJobs} />
				)}
			</div>
		</SubLayout>
	);
}

// Split into smaller components for better code organization
