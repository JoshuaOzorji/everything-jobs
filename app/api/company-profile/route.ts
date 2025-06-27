import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { client } from "@/sanity/lib/client";
import clientPromise from "@/lib/mongoClient";
import User from "@/models/user";

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

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		// Check if user already has a companyId in MongoDB
		const db = (await clientPromise).db();
		const user = await db
			.collection("users")
			.findOne({ email: session.user.email });

		if (user?.companyId) {
			return NextResponse.json(
				{
					error: "User already has a company profile.",
				},
				{ status: 400 },
			);
		}

		const data = await request.json();

		const slug = {
			_type: "slug",
			current: data.name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^\w-]+/g, ""),
		};

		const companyDoc = {
			_type: "company",
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

		// Create company in Sanity
		const createdCompany = await client.create(companyDoc);

		// Update user's companyId in MongoDB
		await db
			.collection("users")
			.updateOne(
				{ email: session.user.email },
				{ $set: { companyId: createdCompany._id } },
			);

		return NextResponse.json(createdCompany);
	} catch (error: any) {
		console.error("Company creation error:", error);
		return NextResponse.json(
			{
				error: "Failed to create company profile",
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
