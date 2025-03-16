import { JobCardProps } from "@/types";
import JobCard from "./JobCard";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

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
  location->{
    name,
    states,
    slug
  },
  jobType->{
    name
  },
  level->{
    name
  },
  publishedAt, 
  summary,
  responsibilities
}`;

const LatestJobs = async () => {
	const jobs = (await client.fetch(
		latestJobsQuery,
	)) as JobCardProps["job"][];

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
