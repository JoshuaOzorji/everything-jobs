import { Metadata } from "next";
import { getRemoteJobs } from "@/sanity/lib/queries";
import Pagination from "@/components/Pagination";
import AsideComponent from "@/components/AsideComponent";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";

export const metadata: Metadata = {
	title: "Remote Jobs in Nigeria | Work from Anywhere",
	description:
		"Browse remote job opportunities across Nigeria. Find flexible, work-from-home positions in various industries and roles.",
	keywords: "remote jobs Nigeria, work from home, online jobs, remote work opportunities",
	openGraph: {
		title: "Remote Jobs in Nigeria | Work from Anywhere",
		description:
			"Discover remote job opportunities that allow you to work from anywhere in Nigeria.",
		type: "website",
	},
};

export default async function RemoteJobsPage() {
	const jobs = await getRemoteJobs();

	return (
		<SubLayout aside={<AsideComponent />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					Remote Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {jobs.length} remote job
						opportunities. Work flexibly
						from anywhere in Nigeria or
						beyond.
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
							No remote jobs currently
							available
						</h2>
						<p className='mt-2'>
							Check back later for new
							remote job
							opportunities.
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
