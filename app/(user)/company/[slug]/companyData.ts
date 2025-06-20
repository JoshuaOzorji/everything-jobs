import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { Company, Job, PaginatedCompanyData } from "@/types/types";

// Company base query
const companyBaseQuery = groq`
  *[_type == "company" && slug.current == $slug][0] {
    _id,
    name,
    logo {
      asset->,
      alt
    },
    description,
    slug,
    website,
    industry-> { name, slug },
    "totalJobs": count(*[_type == "job" && references(^._id)])
  }
`;

// Jobs pagination query
const jobsQuery = groq`
  *[_type == "job" && references($companyId)] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    summary,
    slug,
    publishedAt,
    deadline,
    jobType->{name},
    location->{
      name,
      slug
    },
    level->{name}
  }
`;

// Additional jobs info query needed for the aside
const companyJobsInfoQuery = groq`
  *[_type == "job" && references($companyId)] {
    _id,
    title,
    slug,
    publishedAt,
    deadline
  }
`;

export async function getAllCompanyData(
	slug: string,
	page: number = 1,
	perPage: number = 10,
): Promise<{ companyData: PaginatedCompanyData; jobsInfo: Job[] } | null> {
	// First fetch the company details
	const company = await client.fetch<Company & { totalJobs: number }>(
		companyBaseQuery,
		{ slug },
	);

	if (!company) {
		return null;
	}

	// Fetch paginated jobs and all jobs info in parallel
	const [jobs, jobsInfo] = await Promise.all([
		client.fetch<Job[]>(jobsQuery, {
			companyId: company._id,
			start: (page - 1) * perPage,
			end: (page - 1) * perPage + perPage,
		}),
		client.fetch<Job[]>(companyJobsInfoQuery, {
			companyId: company._id,
		}),
	]);

	return {
		companyData: {
			...company,
			jobs,
			pagination: {
				currentPage: page,
				total: company.totalJobs,
				perPage,
			},
		},
		jobsInfo,
	};
}
