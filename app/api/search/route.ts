// import { NextRequest, NextResponse } from "next/server";
// import { client } from "@/sanity/lib/client";
// import { groq } from "next-sanity";

// // Main search query with filter support
// const searchJobsQuery = groq`
//   *[_type == "job" &&
//     (title match $query + "*" || company->name match $query + "*") &&
//     ($location == "" || location->states[] match $location)
//   ] {
//     _id,
//     title,
//     "slug": slug.current,
//     "company": company->name,
//     "companyLogo": company->logo.asset->url,
//     "location": location->states,
//     "jobType": jobType->name,
//     "level": level->name,
//     "qualification": qualification->name,
//     "jobField": jobField->name,
//     salaryRange,
//     publishedAt,
//     deadline
//   } | order(publishedAt desc)
// `;

// // Query to fetch filter options
// const getFiltersQuery = groq`{
//   "jobTypes": *[_type == "jobType"] { _id, name },
//   "jobLevels": *[_type == "jobLevel"] { _id, name },
//   "qualifications": *[_type == "qualification"] { _id, name },
//   "jobFields": *[_type == "jobField"] { _id, name }
// }`;

// export async function GET(request: NextRequest) {
// 	const searchParams = request.nextUrl.searchParams;
// 	const query = searchParams.get("query") || "";
// 	const location = searchParams.get("location") || "";
// 	const jobType = searchParams.get("jobType") || "";
// 	const jobLevel = searchParams.get("jobLevel") || "";
// 	const qualification = searchParams.get("qualification") || "";
// 	const jobField = searchParams.get("jobField") || "";

// 	try {
// 		// Fetch initial results
// 		let jobs = await client.fetch(searchJobsQuery, {
// 			query,
// 			location,
// 		});

// 		// Apply additional filters client-side (if needed)
// 		if (jobType) {
// 			jobs = jobs.filter(
// 				(job: any) => job.jobType === jobType,
// 			);
// 		}

// 		if (jobLevel) {
// 			jobs = jobs.filter(
// 				(job: any) => job.level === jobLevel,
// 			);
// 		}

// 		if (qualification) {
// 			jobs = jobs.filter(
// 				(job: any) =>
// 					job.qualification === qualification,
// 			);
// 		}

// 		if (jobField) {
// 			jobs = jobs.filter(
// 				(job: any) => job.jobField === jobField,
// 			);
// 		}

// 		// Fetch filter options
// 		const filters = await client.fetch(getFiltersQuery);

// 		return NextResponse.json({ jobs, filters });
// 	} catch (error) {
// 		console.error("Error fetching search results:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to fetch search results" },
// 			{ status: 500 },
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { searchJobsQuery, getFiltersQuery } from "@/sanity/lib/queries";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("query") || "";
	const location = searchParams.get("location") || "";
	const jobType = searchParams.get("jobType") || "";
	const jobLevel = searchParams.get("jobLevel") || "";
	const qualification = searchParams.get("qualification") || "";
	const jobField = searchParams.get("jobField") || "";

	try {
		// Fetch results with all filters applied at database level
		const jobs = await client.fetch(searchJobsQuery, {
			query,
			location,
			jobType,
			jobLevel,
			qualification,
			jobField,
		});

		// Fetch filter options
		const filters = await client.fetch(getFiltersQuery);

		return NextResponse.json({ jobs, filters });
	} catch (error) {
		console.error("Error fetching search results:", error);
		return NextResponse.json(
			{ error: "Failed to fetch search results" },
			{ status: 500 },
		);
	}
}
