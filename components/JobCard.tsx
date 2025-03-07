import { JobCardProps } from "@/types";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { urlFor } from "../sanity/lib/image";
import defaultImg from "@/public/company-default.png";

const JobCard = ({ job }: JobCardProps) => {
	const imageUrl = job.company.logo?.asset?._ref
		? urlFor(job.company.logo).url()
		: defaultImg;

	const locationDisplay =
		job.location?.states?.[0] || job.location?.name || "Nigeria";

	return (
		<div className='flex items-start gap-3 p-3 text-gray-900'>
			<div>
				<Image
					src={imageUrl}
					alt={job.company.name}
					className='h-[8vh] w-full rounded-sm'
					width={50}
					height={50}
				/>
			</div>
			<div className='w-full font-lato'>
				<span className='flex items-center justify-between '>
					<h2 className='text-base font-bold'>
						{job.title}
					</h2>
					<p className='text-sm'>
						{formatDate(
							new Date(
								job.publishedAt,
							),
						)}
					</p>
				</span>

				<div className='flex gap-2 text-sm text-neutral-800'>
					<p>{job.company.name}</p>
					{/* <span>&bull;</span> */}
					<span>|</span>
					<p className='flex'>
						{locationDisplay}{" "}
						<span> ,NG</span>
					</p>
				</div>

				{/* Summary */}

				<div className='text-sm'>
					<span className='flex gap-3'>
						<p className='bg-sec2 px-1 rounded-md capitalize'>
							{job.jobType?.name}
						</p>
						<p className='bg-sec2 px-1 rounded-md capitalize'>
							{job.level?.name}
						</p>
					</span>
				</div>
			</div>
		</div>
	);
};

export default JobCard;
