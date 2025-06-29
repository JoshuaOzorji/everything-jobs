import { client } from "@/sanity/lib/client";
import { getDisplayNameForJobLevel } from "@/sanity/lib/utility";
import Link from "next/link";
import React from "react";
import { MdWorkOutline } from "react-icons/md";

interface JobLevel {
	_id: string;
	name: string;
	slug: string;
	jobCount: number;
	displayName: string;
}

interface JobLevelsProps {
	jobLevels?: JobLevel[];
}

interface SortableJobLevel extends JobLevel {
	sortOrder: number;
}

export const getJobLevels = async function () {
	const jobLevels = await client.fetch(`
    *[_type == "jobLevel"] {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobLevel._ref == ^._id])
    }
  `);

	// Define preferred order matching your utility mapping
	const preferredOrder = [
		"entry-level",
		"mid-level",
		"senior-level",
		"manager",
		"director",
		"executive",
	];

	return jobLevels
		.map(
			(level: {
				_id: string;
				name: string;
				slug: string;
				jobCount: number;
			}) => ({
				...level,
				displayName: getDisplayNameForJobLevel(
					level.slug,
				),
				sortOrder: preferredOrder.indexOf(level.slug),
			}),
		)
		.sort((a: SortableJobLevel, b: SortableJobLevel) => {
			// If both have valid sort orders, use them
			if (a.sortOrder !== -1 && b.sortOrder !== -1) {
				return a.sortOrder - b.sortOrder;
			}
			// If only one has a valid sort order, prioritize it
			if (a.sortOrder !== -1) return -1;
			if (b.sortOrder !== -1) return 1;
			// For items not in preferredOrder, sort by job count
			return b.jobCount - a.jobCount;
		});
};

const JobLevels: React.FC<JobLevelsProps> = ({ jobLevels = [] }) => {
	if (!jobLevels || jobLevels.length === 0) {
		return null;
	}

	return (
		<section className='pt-4 mb-4 text-sm md:text-base'>
			<h2 className='aside-title'>
				Career Experience Levels
			</h2>
			<nav aria-label='Featured job levels navigation'>
				<ul className='grid grid-cols-2 gap-2 font-openSans'>
					{jobLevels.map((jobLevel) => (
						<li key={jobLevel._id}>
							<Link
								href={`/jobs/by-level/${jobLevel.slug}`}
								className='flex items-center justify-between px-2 py-1 text-sm rounded hover:text-pry2 text-myBlack group md:text-base'>
								<span className='flex items-center gap-1'>
									<MdWorkOutline />
									<span className='truncate'>
										{
											jobLevel.displayName
										}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
				{/* CTA */}
				<div className='flex justify-end mt-2 text-sm font-openSans'>
					<Link href='/jobs/by-level'>
						<button className='flex items-center gap-1 underline text-pry2 hover:text-pry'>
							Explore all levels
						</button>
					</Link>
				</div>
			</nav>
		</section>
	);
};

export default JobLevels;
