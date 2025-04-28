// components/RelatedJobs.tsx
import Link from "next/link";
import { ImLocation } from "react-icons/im";
import { IoBriefcase } from "react-icons/io5";

type RelatedJob = {
	_id: string;
	title: string;
	slug: string;
	company: string;
	companySlug: string;
	jobType: string;
	location: string;
	jobField: string;
};

export default function RelatedJobs({ jobs }: { jobs: RelatedJob[] }) {
	if (!jobs || jobs.length === 0) return null;

	return (
		<section className='mt-8 border-t border-zinc-300 pt-6'>
			<h2 className='text-xl font-bold font-poppins text-pry mb-4'>
				Related Jobs
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{jobs.map((job) => (
					<Link
						href={`/jobs/${job.slug}`}
						key={job._id}
						className='p-4 border border-zinc-200 rounded-md hover:shadow-md transition-shadow duration-200'>
						<h3 className='font-semibold text-lg'>
							{job.title}
						</h3>
						<Link
							href={`/company/${job.companySlug}`}
							className='text-pry hover:underline'>
							{job.company}
						</Link>

						<div className='mt-2 text-sm'>
							<div className='flex items-center gap-1 mb-1'>
								<ImLocation className='text-gray-500' />
								<span>
									{
										job.location
									}
								</span>
							</div>
							<div className='flex items-center gap-1'>
								<IoBriefcase className='text-gray-500' />
								<span>
									{
										job.jobType
									}
								</span>
							</div>
						</div>

						<div className='mt-2'>
							<span className='bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded'>
								{job.jobField}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
