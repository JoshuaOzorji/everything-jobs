import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { searchJobsQuery } from "@/sanity/lib/queries";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q") || "";
	const location = searchParams.get("location") || "";
	const jobType = searchParams.get("jobType") || "";
	const jobLevel = searchParams.get("jobLevel") || "";
	const education = searchParams.get("education") || "";
	const jobField = searchParams.get("jobField") || "";

	try {
		// Only fetch jobs - filters are now separate
		const jobs = await client.fetch(searchJobsQuery, {
			q: query || "",
			location,
			jobType,
			jobLevel,
			education,
			jobField,
		});

		return NextResponse.json({ jobs });
	} catch (error) {
		console.error("Error fetching search results:", error);
		return NextResponse.json(
			{ error: "Failed to fetch search results" },
			{ status: 500 },
		);
	}
}
