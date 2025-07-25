import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { searchJobsQuery } from "@/sanity/lib/queries";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const q = searchParams.get("q") || "";
		const location = searchParams.get("location") || "";
		const jobType = searchParams.get("jobType") || "";
		const jobLevel = searchParams.get("jobLevel") || "";
		const education = searchParams.get("education") || "";
		const jobField = searchParams.get("jobField") || "";
		const page = searchParams.get("page") || "1";

		const currentPage = parseInt(page, 10);
		const perPage = 10;
		const offset = (currentPage - 1) * perPage;

		// Fetch search results with pagination
		const searchResults = await client.fetch(searchJobsQuery, {
			q,
			location,
			jobType,
			jobLevel,
			education,
			jobField,
			offset,
			limit: perPage,
		});

		return NextResponse.json({
			jobs: searchResults.jobs,
			total: searchResults.total,
			filters: {}, // You might want to include filters here if needed
		});
	} catch (error) {
		console.error("Search API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch search results" },
			{ status: 500 },
		);
	}
}
