// "use client";

// import { JobCardProps } from "@/types";
// import Image from "next/image";
// import { formatDate } from "@/lib/formatDate";
// import { urlFor } from "../sanity/lib/image";
// import placeholder from "@/public/placeholderCompany.png";
// import { PortableText } from "@portabletext/react";
// import { customSerializers } from "@/lib/customSerializers";
// import Link from "next/link";

// const JobCard = ({ job }: JobCardProps) => {
// 	const imageUrl = job.company.logo?.asset?._ref
// 		? urlFor(job.company.logo).url()
// 		: placeholder;

// 	const locationDisplay = job.location?.name || "Nigeria";

// 	return (
// 		<>
// 			<div className='flex items-start gap-2 p-2 bg-white rounded-md md:px-4 md:py-3 md:gap-3'>
// 				<div>
// 					<Image
// 						src={imageUrl}
// 						alt={job.company.name}
// 						className='h-[8vh] w-full rounded-sm'
// 						width={45}
// 						height={45}
// 					/>
// 				</div>
// 				<div className='w-full font-openSans text-myBlack '>
// 					<span className='flex items-center justify-between '>
// 						<h2 className='text-[13px] md:text-base font-bold flex items-center font-poppins hover:text-pry animate'>
// 							<Link
// 								href={`/job/${job.slug}`}>
// 								{job.title} at{" "}
// 								{
// 									job
// 										.company
// 										.name
// 								}
// 							</Link>
// 						</h2>
// 						<p className='text-sm flex items-center gap-1 text-[11px] md:text-sm'>
// 							<span className='text-base text-pry'>
// 								&bull;
// 							</span>
// 							<span className='text-xs md:text-sm'>
// 								{formatDate(
// 									new Date(
// 										job.publishedAt,
// 									),
// 								)}
// 							</span>
// 						</p>
// 					</span>

// 					{/* Summary */}
// 					<div className='text-[12px] md:text-sm font-openSans line-clamp-2 mb-1'>
// 						<PortableText
// 							value={job.summary}
// 							components={
// 								customSerializers
// 							}
// 						/>
// 					</div>

// 					<div className='flex flex-wrap gap-3 text-xs md:text-[0.85rem] my-1'>
// 						<span className='bg-blue-100 text-blue-800  px-2.5 py-0.5 rounded flex items-center'>
// 							{/* <CiLocationOn /> */}
// 							<p className='font-medium first-letter:uppercase'>
// 								{
// 									locationDisplay
// 								}
// 							</p>
// 						</span>
// 						<span className='bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
// 							{job.jobType?.name}
// 						</span>
// 						<span className='bg-purple-100 text-purple-800  font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
// 							{job.level?.name}
// 						</span>
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default JobCard;

// "use client";

import { JobCardProps } from "@/types";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { urlFor } from "../sanity/lib/image";
import placeholder from "@/public/placeholderCompany.png";
import { PortableText } from "@portabletext/react";
import { customSerializers } from "@/lib/customSerializers";
import Link from "next/link";

const JobCard = ({ job }: JobCardProps) => {
	const imageUrl = job.company.logo?.asset?._ref
		? urlFor(job.company.logo).url()
		: placeholder;

	const locationDisplay = job.location?.name || "Nigeria";

	return (
		<>
			<div className='flex items-start gap-2 p-2 bg-white rounded-md md:px-4 md:py-3 md:gap-3'>
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

					<div className='flex flex-wrap gap-3 text-xs md:text-[0.85rem] my-1'>
						<span className='bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded flex items-center'>
							<p className='font-medium first-letter:uppercase'>
								{
									locationDisplay
								}
							</p>
						</span>
						<span className='bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
							{job.jobType?.name}
						</span>
						<span className='bg-purple-100 text-purple-800 font-medium px-2.5 py-0.5 rounded first-letter:uppercase'>
							{job.level?.name}
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default JobCard;
