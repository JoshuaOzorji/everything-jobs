import { JobCardProps } from "@/types";
import JobCard from "./JobCard";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Pagination from "./PaginationComponent";
import { JOBS_PER_PAGE } from "@/sanity/lib/constants";

// Define the job type based on JobCardProps
type Job = JobCardProps["job"];

// Optimized query that maintains compatibility with JobCard and supports pagination
export async function fetchJobsPaginated(page = 1, perPage = JOBS_PER_PAGE) {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobsQuery = groq`*[_type == "job"] | order(publishedAt desc)[${start}...${end}] {
    _id,
    title,
    "slug": slug.current,
    "company": {
      "name": company->name,
      "logo": company->logo
    },
    "location": {
      "name": location->name,
      "slug": location->slug.current
    },
    "jobType": {
      "name": jobType->name
    },
    "level": {
      "name": level->name
    },
    publishedAt,
    summary
  }`;

	const countQuery = groq`count(*[_type == "job"])`;

	// Run both queries in parallel
	const [jobs, totalCount] = await Promise.all([
		client.fetch<Job[]>(
			jobsQuery,
			{},
			{
				cache: "force-cache",
				next: {
					revalidate: 600,
					tags: ["jobs"],
				},
			},
		),
		client.fetch<number>(countQuery),
	]);

	return { jobs, totalCount };
}

// Consistent caching strategy
export const dynamic = "force-static";
export const revalidate = 600;

// Accept page as a prop instead of trying to read from headers
type LatestJobsProps = {
	page?: number;
};

async function LatestJobs({ page = 1 }: LatestJobsProps) {
	const { jobs, totalCount } = await fetchJobsPaginated(page);

	return (
		<div>
			{jobs.length > 0 ? (
				<>
					<div className='flex flex-col gap-2'>
						{jobs.map((job: Job) => (
							<JobCard
								key={job._id}
								job={job}
							/>
						))}
					</div>
					<Pagination
						currentPage={page}
						total={totalCount}
						perPage={JOBS_PER_PAGE}
					/>
				</>
			) : (
				<div className='p-4 text-center'>
					<p>No jobs available at the moment.</p>
				</div>
			)}
		</div>
	);
}

export default LatestJobs;
