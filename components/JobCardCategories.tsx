import { JobCardProps } from "@/types/types";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { urlForImage } from "../sanity/lib/image";
import placeholder from "@/public/placeholderCompany.png";
import { PortableText } from "@portabletext/react";
import { customSerializers } from "@/lib/customSerializers";
import Link from "next/link";

const JobCardCategories = ({ job }: JobCardProps) => {
	const imageUrl = job.company.logo?.asset?._ref
		? urlForImage(job.company.logo).url()
		: placeholder;

	return (
		<>
			<div className='flex items-start gap-2 p-2 bg-white rounded-md md:p-3 md:gap-3'>
				<div>
					<Image
						src={imageUrl}
						alt={job.company.name}
						className='h-[5vh] w-[5vh] md:h-[6vh] md:w-[6vh] rounded-sm'
						width={50}
						height={50}
						priority
					/>
				</div>
				<div className='w-full font-saira text-myBlack'>
					<div className='flex items-start justify-between'>
						<h2 className='text-[13px] md:text-base font-bold font-poppins hover:text-pry animate max-w-[75%]'>
							<Link
								href={`/job/${job.slug}`}>
								{job.title} at{" "}
								{
									job
										.company
										.name
								}
							</Link>
						</h2>
						<p className='text-sm flex items-center gap-1 text-[11px] md:text-sm whitespace-nowrap flex-shrink-0'>
							<span className='text-base text-pry'>
								&bull;
							</span>
							<span className='text-xs md:text-sm'>
								{formatDate(
									new Date(
										job.publishedAt,
									),
								)}
							</span>
						</p>
					</div>

					{/* Summary */}
					<div className='text-[12px] md:text-sm font-saira line-clamp-2 mb-1'>
						<PortableText
							value={job.summary}
							components={
								customSerializers
							}
						/>
					</div>
					<div className='text-[12px] md:text-sm text-black'>
						<div className='flex gap-3'>
							<Link
								href={`/jobs/by-type/${job.jobType?.slug}`}>
								<p className='px-2 bg-blue-100 rounded-md text-pry first-letter:uppercase hover:underline'>
									{
										job
											.jobType
											?.name
									}
								</p>
							</Link>

							<Link
								href={`/jobs/by-level/${job.level?.slug}`}>
								<p className='px-2 text-green-800 bg-green-100 rounded-md first-letter:uppercase hover:underline'>
									{
										job
											.level
											?.name
									}
								</p>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default JobCardCategories;
