import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
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

		// Build the base query with user filter
		let baseQuery = '*[_type == "pendingJob" && userId == $userId';

		if (status !== "all") {
			baseQuery += ` && status == "${status}"`;
		}

		if (startDate) {
			baseQuery += ` && submittedAt >= "${startDate}"`;
		}

		if (endDate) {
			baseQuery += ` && submittedAt <= "${endDate}"`;
		}

		baseQuery += "] | order(submittedAt desc)";

		// Construct the full queries
		// Update the dataQuery to include more reference fields
		const dataQuery = `${baseQuery}[${start}...${end}] {
			_id,
			title,
			"company": company->{
				name,
				logo
			},
			status,
			submittedAt,
			statusUpdatedAt,
			"location": location->name,
			"jobType": jobType->name,
			deadline
		}`;

		// Pass userId as a parameter object
		const params = { userId: session.user.id };

		const [submissions, totalCount] = await Promise.all([
			client.fetch(dataQuery, params),
			client.fetch(`count(${baseQuery})`, params),
		]);

		return NextResponse.json({
			submissions,
			total: totalCount,
			currentPage: page,
			perPage,
		});
	} catch (error) {
		console.error("Error fetching job submissions:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job submissions" },
			{ status: 500 },
		);
	}
}
