import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { getFiltersQuery } from "@/sanity/lib/queries";

export async function GET() {
	try {
		const filters = await client.fetch(getFiltersQuery);
		return NextResponse.json(filters);
	} catch (error) {
		console.error("Error fetching filters:", error);
		return NextResponse.json(
			{ error: "Failed to fetch filters" },
			{ status: 500 },
		);
	}
}
