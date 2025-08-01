import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";
import { CiLocationOn } from "react-icons/ci";

interface Location {
	_id: string;
	name: string;
	slug: string;
}

interface TopLocationsProps {
	locations?: Location[];
}

export const getTopLocations = async function () {
	return client.fetch(`
    *[_type == "state" && name != "Remote"] {
      _id,
      name,
      "slug": slug.current,
			  "jobCount": count(*[_type == "job" && location._ref == ^._id])
    } | order(jobCount desc)[0...6]
  `);
};

const TopLocations: React.FC<TopLocationsProps> = ({ locations = [] }) => {
	if (!locations || locations.length === 0) {
		return null;
	}

	return (
		<section className='pt-4 mb-4 text-sm'>
			<h2 className='aside-title'>Top Jobs Locations</h2>
			<nav aria-label='Featured locations navigation '>
				<ul className='grid grid-cols-2 gap-1 font-saira'>
					{locations.map((location) => (
						<li key={location._id}>
							<Link
								href={`/jobs/by-location/${location.slug}`}
								className='flex items-center justify-between px-2 py-1 text-sm rounded hover:text-pry2 text-myBlack group md:text-base'>
								<span className='flex items-center gap-1'>
									<CiLocationOn />
									<span className='aside-p'>
										{
											location.name
										}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
				{/* CTA */}
				<div className='flex justify-end mt-2 text-sm font-saira'>
					<Link href='/jobs/by-location'>
						<button className='flex items-center gap-1 underline text-pry2 hover:text-pry'>
							Explore all locations
						</button>
					</Link>
				</div>
			</nav>
		</section>
	);
};

export default TopLocations;
