import { Metadata } from "next";
import { getEducationLevels, getJobsByEducation } from "@/sanity/lib/queries";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import AsideComponent from "@/components/AsideComponent";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";

type EducationLevelType = {
	slug: string;
	name: string;
	jobCount?: number;
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

export async function generateMetadata({
	params,
}: {
	params: { education: string };
}): Promise<Metadata> {
	const education = params.education;

	const educationLevels = await getEducationLevels();
	const educationData = educationLevels.find(
		(level: EducationLevelType) => level.slug === education,
	);

	if (!educationData) return { title: "Education Level not found" };

	return {
		title: `${educationData.name} Jobs in Nigeria | Career Opportunities`,
		description: `Find job vacancies suitable for ${educationData.name} professionals. Browse ${educationData.jobCount || 0} job listings matching this education level.`,
		keywords: `${educationData.name} jobs, jobs for ${educationData.name}, career opportunities`,
		openGraph: {
			title: `${educationData.name} Jobs in Nigeria | Career Opportunities`,
			description: `Job vacancies for ${educationData.name} professionals in Nigeria.`,
			type: "website",
		},
	};
}

export default async function EducationJobsPage({
	params,
}: {
	params: { education: string };
}) {
	const education = await params.education;

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
		<SubLayout aside={<AsideComponent />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					{educationData.name} Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {jobs.length} job
						opportunities for{" "}
						{educationData.name}{" "}
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
					<div className='py-12 text-center'>
						<h2 className='text-xl font-semibold'>
							No jobs currently
							available for{" "}
							{educationData.name}
						</h2>
						<p className='mt-2'>
							Check back later or
							browse jobs in other
							education levels.
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
