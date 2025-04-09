import { client } from "@/sanity/lib/client";
import { getDisplayNameForJobField } from "@/sanity/lib/data";
import Link from "next/link";
import React from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";

interface JobField {
	_id: string;
	name: string;
	slug: string;
	jobCount: number;
	displayName: string;
}

interface TrendingJobFieldsProps {
	jobFields?: JobField[];
}

export const getTrendingJobFields = async function () {
	const jobFields = await client.fetch(`
    *[_type == "jobField"] {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobField._ref == ^._id])
    } | order(jobCount desc)[0...4]
  `);

	return jobFields.map(
		(field: {
			_id: string;
			name: string;
			slug: string;
			jobCount: number;
		}) => ({
			...field,
			displayName: getDisplayNameForJobField(field.slug),
		}),
	);
};

const TrendingJobFields: React.FC<TrendingJobFieldsProps> = ({
	jobFields = [],
}) => {
	if (!jobFields || jobFields.length === 0) {
		return null;
	}

	return (
		<section className='pt-4 mb-4 text-sm md:text-base '>
			<h2 className='aside-title'>Trending Jobs Fields</h2>
			<nav aria-label='Featured job fields navigation'>
				<ul className='font-openSans'>
					{jobFields.map((jobField) => (
						<li key={jobField._id}>
							<Link
								href={`/jobs/by-fields/${jobField.slug}`}
								className='flex items-center justify-between px-2 py-1 text-sm rounded hover:text-pry2 text-myBlack group md:text-base'>
								<span className='flex items-center gap-1'>
									<HiOutlineBriefcase />
									<span className='truncate'>
										{
											jobField.displayName
										}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>

				<div className='flex justify-end mt-2 text-sm font-openSans'>
					<Link href='/jobs/by-field'>
						{/* CTA */}
						<button className='flex items-center gap-1 underline text-pry2 hover:text-pry'>
							Explore all fields
						</button>
					</Link>
				</div>
			</nav>
		</section>
	);
};

export default TrendingJobFields;
