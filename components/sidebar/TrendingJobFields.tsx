// TrendingJobFields.tsx
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";
import { MdOutlineWork } from "react-icons/md"; // Or any other suitable icon

interface JobField {
	_id: string;
	name: string;
	slug: string;
	jobCount: number;
}

interface TrendingJobFieldsProps {
	jobFields?: JobField[];
}

export const getTrendingJobFields = async function () {
	return client.fetch(`
    *[_type == "jobField"] {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobField._ref == ^._id])
    } | order(jobCount desc)[0...4]
  `);
};

const TrendingJobFields: React.FC<TrendingJobFieldsProps> = ({
	jobFields = [],
}) => {
	if (!jobFields || jobFields.length === 0) {
		return null;
	}

	return (
		<section className='py-4'>
			<h2 className='mb-3 text-lg font-semibold text-pry font-poppins'>
				Jobs By Field
			</h2>
			<nav aria-label='Featured job fields navigation'>
				<ul className='font-openSans'>
					{jobFields.map((jobField) => (
						<li key={jobField._id}>
							<Link
								href={`/jobs/fields/${jobField.slug}`}
								className='flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#e6e6eb] text-myBlack group'>
								<span className='flex items-center'>
									<MdOutlineWork className='mr-1' />
									<span className='truncate'>
										{
											jobField.name
										}
									</span>
								</span>
								<span className='bg-[#e6e6eb] text-myBlack text-xs px-2 py-0.5 rounded-full ml-1 group-hover:bg-[#2563eb] group-hover:text-white transition-colors'>
									{
										jobField.jobCount
									}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</section>
	);
};

export default TrendingJobFields;
