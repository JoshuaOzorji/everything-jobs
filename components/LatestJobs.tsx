import { JobCardProps } from "@/types";
import JobCard from "./JobCard";
import { client } from "@/sanity/lib/client";

type Job = JobCardProps["job"];

const LatestJobs = async () => {
	const jobs: Job[] =
		await client.fetch(`*[_type == "job"] | order(publishedAt desc)[0...10] {
    _id,
    title,
		"slug": slug.current,
    company->{
      name,
      logo,
			"slug": slug.current,
    },
    location->{
      name,
      states,
			 "slug": slug.current 
    },
    jobType->{
      name
    },
    level->{
      name
    },
    publishedAt, 
		summary,
  }`);

	console.log(jobs);
	return (
		<main className=''>
			<h2 className='text-xl font-poppins'>Latest Jobs</h2>
			<div className='flex flex-col gap-4 md:flex-row'>
				<section className='md:w-[65%] '>
					{jobs.length > 0 ? (
						<div className='flex flex-col gap-2 '>
							{jobs.map((job) => (
								<JobCard
									key={
										job._id
									}
									job={
										job
									}
								/>
							))}
						</div>
					) : (
						<div className='p-4 text-center'>
							<p>
								No jobs
								available at the
								moment.
							</p>
						</div>
					)}
				</section>
				<aside className='md:w-[35%] bg-white'>
					Right
				</aside>
			</div>
		</main>
	);
};

export default LatestJobs;
