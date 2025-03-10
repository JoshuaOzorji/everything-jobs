import { JobCardProps } from "@/types";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { urlFor } from "../sanity/lib/image";
import defaultImg from "@/public/company-default.png";
import { PortableText } from "@portabletext/react";
import { customSerializers } from "@/lib/customSerializers";
import Link from "next/link";

const JobCard = ({ job }: JobCardProps) => {
	const imageUrl = job.company.logo?.asset?._ref
		? urlFor(job.company.logo).url()
		: defaultImg;

	const locationDisplay =
		job.location?.states?.[0] || job.location?.name || "Nigeria";

	return (
		<div className='flex items-start gap-2 p-2 bg-white rounded-md md:p-3 md:gap-3 '>
			<div>
				<Image
					src={imageUrl}
					alt={job.company.name}
					className='h-[8vh] w-full rounded-sm'
					width={50}
					height={50}
				/>
			</div>
			<div className='w-full font-openSans text-myBlack '>
				<span className='flex items-center justify-between '>
					<h2 className='text-[13px] md:text-base font-bold flex items-center font-poppins'>
						<Link href={`/job/${job.slug}`}>
							{job.title} at{" "}
							{job.company.name}
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

				<div className='flex gap-2 text-sm border-b font-poppins'>
					<p>{locationDisplay}</p>
				</div>

				{/* Summary */}
				<div className='text-[12px] md:text-sm font-openSans line-clamp-2 my-1'>
					<PortableText
						value={job.summary}
						components={customSerializers}
					/>
				</div>
				<div className='text-[12px] md:text-sm text-black'>
					<span className='flex gap-3'>
						<p className='px-1 capitalize rounded-md bg-sec2'>
							{job.jobType?.name}
						</p>
						<p className='px-1 capitalize rounded-md bg-sec2'>
							{job.level?.name}
						</p>
					</span>
				</div>
			</div>
		</div>
	);
};

export default JobCard;
