import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { searchJobsQuery, getFiltersQuery } from "@/sanity/lib/queries";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q") || "";
	const location = searchParams.get("location") || "";
	const jobType = searchParams.get("jobType") || "";
	const jobLevel = searchParams.get("jobLevel") || "";
	const qualification = searchParams.get("qualification") || "";
	const jobField = searchParams.get("jobField") || "";

	try {
		// Fetch results with all filters applied at database level
		const jobs = await client.fetch(searchJobsQuery, {
			q: query || "",
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
