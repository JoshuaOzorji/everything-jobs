import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";
import { CiCalendarDate } from "react-icons/ci";

interface JobType {
	_id: string;
	name: string;
	slug: string;
	jobCount: number;
}

interface JobTypesProps {
	jobTypes?: JobType[];
}

export const getJobTypes = async function () {
	return client.fetch(`
    *[_type == "jobType" && lower(name) != "others"] {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobType._ref == ^._id])
    } | order(jobCount desc)[0...4]
  `);
};

const JobTypes: React.FC<JobTypesProps> = ({ jobTypes = [] }) => {
	if (!jobTypes || jobTypes.length === 0) {
		return null;
	}

	return (
		<section className='pt-4 mb-4 text-sm md:text-base'>
			<h2 className='aside-title'>
				Popular Employment Types
			</h2>
			<nav aria-label='Featured job types navigation'>
				<ul className='grid grid-cols-2 gap-2 font-openSans'>
					{jobTypes.map((jobType) => (
						<li key={jobType._id}>
							<Link
								href={`/jobs/by-type/${jobType.slug}`}
								className='flex items-center justify-between px-2 py-1 text-sm rounded hover:text-pry2 text-myBlack group md:text-base'>
								<span className='flex items-center gap-1'>
									<CiCalendarDate />
									<span className='truncate first-letter:capitalize'>
										{
											jobType.name
										}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
				{/* CTA */}
				<div className='flex justify-end mt-2 text-sm font-openSans'>
					<Link href='/jobs/by-type'>
						<button className='flex items-center gap-1 underline text-pry2 hover:text-pry'>
							Explore all types
						</button>
					</Link>
				</div>
			</nav>
		</section>
	);
};

export default JobTypes;
