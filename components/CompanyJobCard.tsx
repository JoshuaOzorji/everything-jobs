import React from "react";
import Link from "next/link";
import { formatDate2 } from "@/lib/formatDate2";
import { Job } from "@/types";

interface CompanyJobCardProps {
	job: Job;
}

const CompanyJobCard: React.FC<CompanyJobCardProps> = ({ job }) => {
	const locationDisplay = job.location?.name || "Nigeria";

	return (
		<div className='p-4 transition-shadow bg-white border rounded-lg hover:shadow-md font-openSans'>
			<Link
				href={`/job/${job.slug.current}`}
				className='mb-2 text-base font-poppins hover:text-pry2'>
				{job.title}
			</Link>

			<div className='flex flex-wrap gap-2 mb-3 text-xs md:text-[0.85rem]'>
				<span className='bg-blue-100 text-blue-800  px-2.5 py-0.5 rounded flex items-center'>
					<p className='first-letter:uppercase font-medium'>
						{locationDisplay}
					</p>
				</span>
				<span className='bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
					<Link
						href={`/jobs/by-type/${job.jobType?.name}`}>
						{job.jobType.name}
					</Link>
				</span>
				<span className='bg-purple-100 text-purple-800  font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
					<Link
						href={`/jobs/by-level/${job.level?.name}`}>
						{job.level?.name}
					</Link>
				</span>
			</div>

			<div className='text-[0.85rem] text-myBlack'>
				<p>
					Posted:{" "}
					{formatDate2(new Date(job.publishedAt))}
				</p>
				{job.deadline && (
					<p>
						Deadline:{" "}
						{formatDate2(
							new Date(job.deadline),
						)}
					</p>
				)}
			</div>
		</div>
	);
};

export default CompanyJobCard;
