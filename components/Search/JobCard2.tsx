import Image from "next/image";
import { SearchJobResult } from "@/types";
import { formatDate } from "@/lib/formatDate";
import { PortableText } from "next-sanity";
import { customSerializers } from "@/lib/customSerializers";
import Link from "next/link";

interface JobCard2Props {
	job: SearchJobResult;
}

const JobCard2: React.FC<JobCard2Props> = ({ job }) => {
	const locationName = job.location;
	const jobTypeName = job.jobType;
	const levelName = job.level;

	return (
		<div className='px-4 py-3 transition bg-white rounded shadow md:p-4 hover:shadow-sm'>
			<div className='flex gap-3'>
				{job.companyLogo && (
					<div className='overflow-hidden rounded'>
						<Image
							src={job.companyLogo}
							alt={job.company}
							className='h-[5vh] w-[5vh] md:h-[6vh] md:w-[6vh] rounded-sm'
							width={50}
							height={50}
							priority
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

					{/* Summary */}
					<div className='hidden overflow-hidden text-sm md:block font-openSans'>
						<div className='line-clamp-2'>
							<PortableText
								value={
									job.summary
								}
								components={
									customSerializers
								}
							/>
						</div>
					</div>

					<div className='flex flex-wrap gap-3 mt-2 font-openSans'>
						{locationName && (
							<span className='px-2 py-0.5 text-[12.5px] text-blue-800 bg-blue-100 rounded first-letter:uppercase'>
								{locationName}
							</span>
						)}
						<span className='px-2 py-0.5 text-[12.5px] text-green-800 bg-green-100 rounded first-letter:uppercase'>
							{jobTypeName}
						</span>
						<span className='px-2 py-0.5 text-[12.5px] text-purple-800 bg-purple-100 rounded first-letter:uppercase'>
							{levelName}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobCard2;
