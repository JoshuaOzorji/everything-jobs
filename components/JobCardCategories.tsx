import { JobCardProps } from "@/types";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { urlFor } from "../sanity/lib/image";
import placeholder from "@/public/placeholderCompany.png";
import { PortableText } from "@portabletext/react";
import { customSerializers } from "@/lib/customSerializers";
import Link from "next/link";

const JobCardCategories = ({ job }: JobCardProps) => {
	const imageUrl = job.company.logo?.asset?._ref
		? urlFor(job.company.logo).url()
		: placeholder;

	return (
		<>
			<div className='flex items-start gap-2 p-2 bg-white rounded-md md:p-3 md:gap-3 '>
				<div>
					<Image
						src={imageUrl}
						alt={job.company.name}
						className='h-[8vh] w-full rounded-sm'
						width={45}
						height={45}
					/>
				</div>
				<div className='w-full font-openSans text-myBlack '>
					<span className='flex items-center justify-between '>
						<h2 className='text-[13px] md:text-base font-bold flex items-center font-poppins hover:text-pry animate'>
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
						<p className='text-sm flex items-center gap-1 text-[11px] md:text-sm'>
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
					</span>

					{/* Summary */}
					<div className='text-[12px] md:text-sm font-openSans line-clamp-2 mb-1'>
						<PortableText
							value={job.summary}
							components={
								customSerializers
							}
						/>
					</div>
					<div className='text-[12px] md:text-sm text-black'>
						<span className='flex gap-3'>
							<p className='px-2 bg-blue-100 rounded-md text-pry first-letter:uppercase'>
								{
									job
										.jobType
										?.name
								}
							</p>

							<p className='px-2 text-green-800 bg-green-100 rounded-md first-letter:uppercase'>
								{
									job
										.level
										?.name
								}
							</p>
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default JobCardCategories;
