import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";
import { MdWorkOutline } from "react-icons/md";

interface JobLevel {
	_id: string;
	name: string;
	slug: string;
	jobCount: number;
}

interface JobLevelsProps {
	jobLevels?: JobLevel[];
}

export const getJobLevels = async function () {
	return client.fetch(`
    *[_type == "jobLevel"] {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobLevel._ref == ^._id])
    } | order(jobCount desc)
  `);
};

const JobLevels: React.FC<JobLevelsProps> = ({ jobLevels = [] }) => {
	if (!jobLevels || jobLevels.length === 0) {
		return null;
	}

	return (
		<section className='pt-4 mb-4 text-sm md:text-base'>
			<h2 className='mb-3 font-semibold text-pry2 font-poppins'>
				Job Levels
			</h2>
			<nav aria-label='Featured job levels navigation'>
				<ul className='grid grid-cols-2 gap-2 font-openSans'>
					{jobLevels.map((jobLevel) => (
						<li key={jobLevel._id}>
							<Link
								href={`/jobs/by-level/${jobLevel.slug}`}
								className='flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#e6e6eb] text-myBlack group'>
								<span className='flex items-center gap-1'>
									<MdWorkOutline />
									<span className='truncate first-letter:capitalize'>
										{
											jobLevel.name
										}
									</span>
								</span>
								<span className='bg-[#e6e6eb] text-myBlack text-xs px-2 py-0.5 rounded-full ml-1 group-hover:bg-[#2563eb] group-hover:text-white transition-colors'>
									{
										jobLevel.jobCount
									}
								</span>
							</Link>
						</li>
					))}
				</ul>
				{/* CTA */}
				<div className='flex justify-end mt-2 text-sm font-openSans'>
					<Link href='/jobs/by-level'>
						<button className='flex items-center gap-1 underline text-pry2 hover:text-pry'>
							Explore all jobs levels
						</button>
					</Link>
				</div>
			</nav>
		</section>
	);
};

export default JobLevels;
