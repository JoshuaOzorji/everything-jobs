import { JobCardProps } from "@/types";
import JobCard from "./JobCard";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { cache, Suspense } from "react";

const latestJobsQuery = groq`*[_type == "job"] | order(publishedAt desc)[0...10] {
  _id,
  title,
  "slug": slug.current,
  company->{
    name,
    logo{
      asset{
        _ref
      }
    }
  },
  "location": location->{
    name,
    "slug": slug.current
  },
  "jobType": jobType->name,
  "level": level->name,
  publishedAt,
  summary
}`;

async function fetchJobs() {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return client.fetch(
		latestJobsQuery,
		{},
		{
			cache: "force-cache",
			next: {
				revalidate: 600,
				tags: ["jobs"],
			},
		},
	) as Promise<JobCardProps["job"][]>;
}

export const dynamic = "force-static";
export const revalidate = 600;

const LatestJobs = async () => {
	const jobs = await fetchJobs();

	return (
		<div>
			{jobs.length > 0 ? (
				<div className='flex flex-col gap-2'>
					{jobs.map((job) => (
						<JobCard
							key={job._id}
							job={job}
						/>
					))}
				</div>
			) : (
				<div className='p-4 text-center'>
					<p>No jobs available at the moment.</p>
				</div>
			)}
		</div>
	);
};

export default LatestJobs;
