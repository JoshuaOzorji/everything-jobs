import Link from "next/link";
import Image from "next/image";
import { LuCalendar1 } from "react-icons/lu";
import { formatDate } from "@/lib/formatDate";
import { Job } from "@/types/types";

interface JobHeaderProps {
	job: Job;
	imageUrl: string;
}

export default function JobHeader({ job, imageUrl }: JobHeaderProps) {
	return (
		<div className='flex items-center justify-between text-xs font-poppins md:text-sm'>
			<div className='flex items-center gap-2'>
				<Image
					src={imageUrl}
					alt={job.company.name}
					className='h-[4vh] w-[4vh] md:h-[5vh] md:w-[5vh] rounded-full'
					width={50}
					height={50}
					priority
				/>

				<Link href={`/company/${job.company.slug}`}>
					<p className='hover:underline'>
						{job.company.name}
					</p>
				</Link>
			</div>

			{job.publishedAt && (
				<p className='flex items-center gap-1'>
					<LuCalendar1 />
					{formatDate(new Date(job.publishedAt))}
				</p>
			)}
		</div>
	);
}
