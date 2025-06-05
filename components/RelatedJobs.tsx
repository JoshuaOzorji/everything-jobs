import React from "react";
import Link from "next/link";
import { JobReference } from "@/types/types";

type RelatedJob = {
	_id: string;
	title: string;
	slug: string;
	company: string;
	companySlug: string;
	jobType: JobReference;
	location: JobReference;
	jobField: JobReference;
	level: JobReference;
};

interface RelatedJobCardProps {
	job: RelatedJob;
}

const RelatedJobCard: React.FC<RelatedJobCardProps> = ({ job }) => {
	return (
		<div className='p-3 md:p-4 transition-shadow bg-white border rounded-lg hover:shadow-sm font-openSans'>
			<div className='text-sm font-poppins hover:text-pry2 mb-2'>
				<Link href={`/job/${job.slug}`}>
					{job.title} at {job.company}
				</Link>
			</div>

			<div className='flex flex-wrap gap-2 text-xs md:text-[0.85rem] '>
				<span className='bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded flex items-center first-letter:uppercase font-medium'>
					<Link
						href={`/jobs/by-location/${job.location?.slug?.current || ""}`}>
						{job.location?.name ||
							"Nigeria"}
					</Link>
				</span>
				{job.jobType && (
					<span className='bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
						<Link
							href={`/jobs/by-type/${job.jobType?.slug}`}>
							{job.jobType?.name}
						</Link>
					</span>
				)}

				<span className='bg-purple-100 text-purple-800  font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
					<Link
						href={`/jobs/by-level/${job.level?.slug}`}>
						{job.level?.name}
					</Link>
				</span>
			</div>
		</div>
	);
};

export default function RelatedJobs({ jobs }: { jobs: RelatedJob[] }) {
	if (!jobs || jobs.length === 0) return null;

	return (
		<section className='mt-8 border-t border-zinc-300 pt-6'>
			<h2 className='text-xl font-bold font-poppins text-pry mb-4'>
				Jobs you may also like:
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{jobs.map((job) => (
					<RelatedJobCard
						key={job._id}
						job={job}
					/>
				))}
			</div>
		</section>
	);
}
