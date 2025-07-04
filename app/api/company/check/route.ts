import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import clientPromise from "@/lib/mongoClient";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json(
				{ exists: false },
				{ status: 200 },
			);
		}

		const db = (await clientPromise).db();
		const user = await db
			.collection("users")
			.findOne({ email: session.user.email });

		const hasCompany = !!user?.companyId;

		return NextResponse.json(
			{ exists: hasCompany },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error in /api/company/check:", error);
		return NextResponse.json(
			{ exists: false, error: "Server error" },
			{ status: 500 },
		);
	}
}
