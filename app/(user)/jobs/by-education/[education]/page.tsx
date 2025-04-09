import { Metadata } from "next";
import { getEducationLevels, getJobsByEducation } from "@/sanity/lib/queries";
import Pagination from "@/components/PaginationComponent";
import { notFound } from "next/navigation";
import AsideMain from "@/components/sidebar/AsideMain";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";
import Link from "next/link";

type Params = {
	params: Promise<{ education: string }>;
};

type EducationLevelType = {
	slug: string;
	name: string;
	jobCount?: number;
	displayName?: string;
};

export async function generateStaticParams() {
	const educationLevels: EducationLevelType[] =
		await getEducationLevels();
	return educationLevels
		.filter((level) => level.slug)
		.map((level) => ({
			education: level.slug,
		}));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { education } = await params;

	const educationLevels = await getEducationLevels();
	const educationData = educationLevels.find(
		(level: EducationLevelType) => level.slug === education,
	);

	if (!educationData) return { title: "Education Level not found" };

	return {
		title: `${educationData.displayName} Jobs in Nigeria | Career Opportunities`,
		description: `Find job vacancies suitable for ${educationData.displayName} professionals. Browse ${educationData.jobCount || 0} job listings matching this education level.`,
		keywords: `${educationData.displayName} jobs, jobs for ${educationData.displayName}, career opportunities`,
		openGraph: {
			title: `${educationData.displayName} Jobs in Nigeria | Career Opportunities`,
			description: `Job vacancies for ${educationData.displayName} professionals in Nigeria.`,
			type: "website",
		},
	};
}

export default async function EducationJobsPage({ params }: Params) {
	const { education } = await params;
	// Validate education parameter
	if (!education || education === "null") {
		return notFound();
	}

	const educationLevels: EducationLevelType[] =
		await getEducationLevels();
	const educationData = educationLevels.find(
		(level: EducationLevelType) => level.slug === education,
	);

	if (!educationData) {
		return notFound();
	}

	const jobs = await getJobsByEducation(education);

	return (
		<SubLayout aside={<AsideMain />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					{educationData.displayName ||
						educationData.name}{" "}
					Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {jobs.length} job
						opportunities for{" "}
						{educationData.displayName}{" "}
						professionals. Find your next
						career move.
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
							{
								educationData.displayName
							}
						</h2>

						<Link
							href='/jobs/by-education'
							className=''>
							<button className='px-4 py-2 mt-2 text-sm font-medium underline transition-colors text-pry2 md:text-base hover:text-pry'>
								Browse all
								education levels
							</button>
						</Link>
					</div>
				)}

				{jobs.length > 10 && (
					<Pagination total={jobs.length} />
				)}
			</div>
		</SubLayout>
	);
}
