import { Metadata } from "next";
import {
	getQualifications,
	getJobsByQualification,
} from "@/sanity/lib/queries";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import AsideComponent from "@/components/AsideComponent";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";

type QualificationType = {
	slug: string;
	name: string;
	jobCount?: number;
};

export async function generateStaticParams() {
	const qualifications: QualificationType[] = await getQualifications();
	return qualifications
		.filter((qualification) => qualification.slug)
		.map((qualification) => ({
			qualification: qualification.slug,
		}));
}

export async function generateMetadata({
	params,
}: {
	params: { qualification: string };
}): Promise<Metadata> {
	const qualifications = await getQualifications();
	const qualificationData = qualifications.find(
		(qual: QualificationType) => qual.slug === params.qualification,
	);

	if (!qualificationData) return { title: "Qualification not found" };

	return {
		title: `${qualificationData.name} Jobs in Nigeria | Career Opportunities`,
		description: `Find job opportunities for ${qualificationData.name} qualification. Browse ${qualificationData.jobCount || 0} job listings suitable for ${qualificationData.name} holders.`,
		keywords: `${qualificationData.name} jobs, jobs for ${qualificationData.name}, career opportunities for ${qualificationData.name} holders`,
		openGraph: {
			title: `${qualificationData.name} Jobs in Nigeria | Career Opportunities`,
			description: `Find job opportunities for ${qualificationData.name} qualification in Nigeria.`,
			type: "website",
		},
	};
}

export default async function QualificationJobsPage({
	params,
}: {
	params: { qualification: string };
}) {
	const { qualification } = params;

	// Validate qualification parameter
	if (!qualification || qualification === "null") {
		return notFound();
	}

	const qualifications: QualificationType[] = await getQualifications();
	const qualificationData = qualifications.find(
		(qual: QualificationType) =>
			qual.slug === decodeURIComponent(qualification),
	);

	if (!qualificationData) {
		return notFound();
	}

	const jobs = await getJobsByQualification(qualificationData.slug);

	return (
		<SubLayout aside={<AsideComponent />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					{qualificationData.name} Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {jobs.length} job
						opportunities for{" "}
						{qualificationData.name}{" "}
						qualification holders. Find your
						next career opportunity that
						matches your educational
						background.
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
							{qualificationData.name}{" "}
							qualification
						</h2>
						<p className='mt-2'>
							Check back later or
							browse jobs for other
							qualifications.
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
