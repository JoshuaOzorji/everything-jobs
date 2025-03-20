import Image from "next/image";
import Link from "next/link";
import { JobQuery } from "@/types";
import { formatDate } from "@/lib/formatDate";

interface JobCardProps2 {
	job: JobQuery;
}

const JobCard2: React.FC<JobCardProps2> = ({ job }) => {
	return (
		<div className='px-4 py-3 transition bg-white rounded shadow md:p-4 hover:shadow-sm'>
			<div className='flex gap-3'>
				{job.companyLogo && (
					<div className='w-12 h-12 overflow-hidden rounded'>
						<Image
							src={job.companyLogo}
							alt={job.company}
							width={48}
							height={48}
							className='w-full h-full rounded-sm'
						/>
					</div>
				)}

				<div className='flex flex-col flex-1'>
					<div className='flex justify-between w-full'>
						<Link
							href={`/job/${job.slug}`}
							className='text-[13px] md:text-base font-bold flex items-center font-poppins hover:text-pry animate'>
							{job.title}
						</Link>

						<p className='text-sm flex items-center gap-1 text-[11px] md:text-sm'>
							<span className='text-base text-pry'>
								&bull;
							</span>
							<span className='text-xs md:text-sm font-poppins'>
								{formatDate(
									new Date(
										job.publishedAt,
									),
								)}
							</span>
						</p>
					</div>
					<div>
						<p className='text-sm text-myBlack font-poppins'>
							{job.company}
						</p>
					</div>

					<div className='flex flex-wrap gap-3 mt-2 font-openSans'>
						{job.location &&
							job.location.length >
								0 && (
								<span className='px-2 py-0.5 text-sm text-blue-800 bg-blue-100 rounded first-letter:uppercase'>
									{
										job
											.location[0]
									}
								</span>
							)}
						<span className='px-2 py-0.5 text-sm text-green-800 bg-green-100 rounded first-letter:uppercase'>
							{job.jobType}
						</span>
						<span className='px-2 py-0.5 text-sm text-purple-800 bg-purple-100 rounded first-letter:uppercase'>
							{job.level}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobCard2;
