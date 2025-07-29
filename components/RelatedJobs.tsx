import React from "react";
import Link from "next/link";
import { RelatedJob } from "@/types/types";

interface RelatedJobCardProps {
	job: RelatedJob;
}

const RelatedJobCard: React.FC<RelatedJobCardProps> = ({ job }) => {
	return (
		<div className='p-3 transition-shadow bg-white border rounded-lg md:p-4 hover:shadow-sm font-saira'>
			<div className='mb-2 text-xs font-medium md:text-sm font-poppins hover:text-pry animate'>
				<Link href={`/job/${job.slug}`}>
					{job.title} at {job.company.name}
				</Link>
			</div>

			<div className='flex flex-wrap gap-2 text-[11px] md:text-xs'>
				<span className='bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded flex items-center first-letter:uppercase font-medium hover:underline'>
					<Link
						href={`/jobs/by-location/${job.location?.slug || ""}`}>
						{job.location?.name ||
							"Nigeria"}
					</Link>
				</span>
				{job.jobType && (
					<span className='bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase hover:underline'>
						<Link
							href={`/jobs/by-type/${job.jobType?.slug || ""}`}>
							{job.jobType?.name}
						</Link>
					</span>
				)}

				<span className='bg-purple-100 text-purple-800  font-medium px-2.5 py-0.5 rounded first-letter:uppercase hover:underline'>
					<Link
						href={`/jobs/by-level/${job.level?.slug || ""}`}>
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
		<section className='pt-6 mt-8 border-t border-zinc-300'>
			<h2 className='mb-4 text-xl font-bold font-poppins text-pry'>
				Jobs you may also like:
			</h2>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
