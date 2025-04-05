import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";
import { CiLocationOn } from "react-icons/ci";

interface Location {
	_id: string;
	name: string;
	slug: string;
	jobCount: number;
}

interface TrendingLocationsProps {
	locations?: Location[];
}

export const getTrendingLocations = async function () {
	return client.fetch(`
    *[_type == "state" && name != "Remote"] {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && location._ref == ^._id])
    } | order(jobCount desc)[0...4]
  `);
};

const TrendingLocations: React.FC<TrendingLocationsProps> = ({
	locations = [],
}) => {
	if (!locations || locations.length === 0) {
		return null;
	}

	return (
		<section className='mb-4'>
			<h2 className='mb-3 text-lg font-semibold text-pry font-poppins'>
				Trending Jobs Locations
			</h2>
			<nav aria-label='Featured locations navigation '>
				<ul className='grid grid-cols-2 gap-2 font-openSans'>
					{locations.map((location) => (
						<li key={location._id}>
							<Link
								href={`/jobs/by-location/${location.slug}`}
								className='flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#e6e6eb] text-myBlack group'>
								<span className='flex items-center'>
									<CiLocationOn />
									<span className='truncate'>
										{
											location.name
										}
									</span>
								</span>
								<span className='bg-[#e6e6eb] text-myBlack text-xs px-2 py-0.5 rounded-full ml-1 group-hover:bg-[#2563eb] group-hover:text-white transition-colors'>
									{
										location.jobCount
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

export default TrendingLocations;
