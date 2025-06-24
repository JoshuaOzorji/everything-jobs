import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { client } from "@/sanity/lib/client";

export async function PATCH(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const data = await request.json();

		// Generate slug from company name
		const slug = {
			_type: "slug",
			current: data.name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^\w-]+/g, ""),
		};

		const companyUpdate = {
			name: data.name,
			website: data.website,
			industry: {
				_type: "reference",
				_ref: data.industry,
			},
			description: data.description,
			slug,
			...(data.logo && { logo: data.logo }),
		};

		// Update company document in Sanity
		const result = await client
			.patch(data._id)
			.set(companyUpdate)
			.commit();

		return NextResponse.json(result);
	} catch (error: any) {
		console.error("Company update error:", error);
		return NextResponse.json(
			{
				error: "Failed to update company profile",
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
