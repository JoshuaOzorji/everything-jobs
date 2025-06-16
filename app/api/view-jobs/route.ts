import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const status = searchParams.get("status") || "all";
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const perPage = 10;
		const start = (page - 1) * perPage;
		const end = start + perPage;

		// Build the base query
		let baseQuery = '*[_type == "pendingJob"';

		if (status !== "all") {
			baseQuery += ` && status == "${status}"`;
		}

		if (startDate) {
			baseQuery += ` && submittedAt >= "${startDate}"`;
		}

		if (endDate) {
			baseQuery += ` && submittedAt <= "${endDate}"`;
		}

		baseQuery += "]";

		// Construct the full queries
		const dataQuery = `${baseQuery} | order(submittedAt desc) [${start}...${end}] {
            _id,
            title,
            companyName,
            status,
            submittedAt,
            rejectionReason
        }`;

		const countQuery = `count(${baseQuery})`;

		const [submissions, totalResult] = await Promise.all([
			client.fetch(dataQuery),
			client.fetch(countQuery),
		]);

		return NextResponse.json({
			submissions,
			total: totalResult,
		});
	} catch (error) {
		console.error("Error fetching job submissions:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job submissions" },
			{ status: 500 },
		);
	}
}
