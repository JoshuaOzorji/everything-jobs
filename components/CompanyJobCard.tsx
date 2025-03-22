import React from "react";
import Link from "next/link";
import { formatDate2 } from "@/lib/formatDate2";

type JobType = {
	_id: string;
	title: string;
	slug: { current: string };
	publishedAt: string;
	deadline?: string;
	jobType: { name: string };
	location: {
		name: string;
		states?: string[];
	} | null;
	level: { name: string };
};

interface CompanyJobCardProps {
	job: JobType;
}

const CompanyJobCard: React.FC<CompanyJobCardProps> = ({ job }) => {
	// const locationDisplay = job.location?.name || "Nigeria";

	const locationDisplay =
		job.location?.states?.[0] || job.location?.name || "Nigeria";

	return (
		<div className='p-4 transition-shadow bg-white border rounded-lg hover:shadow-md font-openSans'>
			<Link
				href={`/job/${job.slug.current}`}
				className='mb-2 text-base font-poppins hover:text-pry2'>
				{job.title}
			</Link>

			<div className='flex flex-wrap gap-2 mb-3 text-xs md:text-[0.85rem]'>
				<span className='bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
					{job.jobType.name}
				</span>
				<span className='bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
					{locationDisplay}
				</span>
				<span className='bg-purple-100 text-purple-800  font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
					{job.level.name}
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
