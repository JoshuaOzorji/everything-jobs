import Image from "next/image";
import { SearchJobResult } from "@/types/types";
import { formatDate } from "@/lib/formatDate";
import { PortableText } from "next-sanity";
import { customSerializers } from "@/lib/customSerializers";
import Link from "next/link";
import placeholder from "@/public/placeholderCompany.png";

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
				<div className='jobcard-image-container'>
					<Image
						src={
							job.company.logo ||
							placeholder
						}
						alt={job.company.name}
						className='object-cover w-full h-full'
						width={50}
						height={50}
					/>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex w-full'>
						<div className='flex-1 min-w-0'>
							<Link
								href={`/job/${job.slug}`}
								className='flex items-center text-xs font-bold md:text-sm font-poppins hover:text-pry animate'>
								{job.title}
							</Link>
						</div>

						<div className='flex-shrink-0 ml-2'>
							<p className='flex items-center gap-1 text-[11px] md:text-xs whitespace-nowrap font-saira'>
								<span className='text-xs text-pry'>
									&bull;
								</span>
								<span>
									{formatDate(
										new Date(
											job.publishedAt,
										),
									)}
								</span>
							</p>
						</div>
					</div>
					<div>
						<p className='text-xs md:text-[13px] text-myBlack font-poppins'>
							{job.company.name}
						</p>
					</div>

					{/* Summary */}
					<div className='overflow-hidden text-[11px] md:text-[13px] md:block font-saira'>
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

					<div className='flex flex-wrap gap-3 mt-2 font-saira text-[11px] md:text-xs'>
						{locationName && (
							<span className='px-2 py-0.5 text-blue-800 bg-blue-100 rounded first-letter:uppercase'>
								{locationName}
							</span>
						)}
						<span className='px-2 py-0.5 text-green-800 bg-green-100 rounded first-letter:uppercase'>
							{jobTypeName}
						</span>
						<span className='px-2 py-0.5 text-purple-800 bg-purple-100 rounded first-letter:uppercase'>
							{levelName}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobCard2;
