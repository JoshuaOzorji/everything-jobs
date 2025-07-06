import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/config";
import { client } from "@/sanity/lib/client";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const job = await request.json();

		console.log("Received job data:", job);

		// Validate required fields
		if (!job.title || !job.summary || !job.location?._ref) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Create pending job document with proper structure
		const result = await client.create({
			_type: "pendingJob",
			title: job.title,
			company: {
				_type: "reference",
				_ref: session.user.companyId,
			},
			summary: job.summary, // Already in block format
			location: job.location, // Already in reference format
			jobType: job.jobType,
			education: job.education,
			jobField: job.jobField,
			level: job.level,
			deadline: job.deadline,
			salaryRange: job.salaryRange,
			requirements: job.requirements, // Already string array
			responsibilities: job.responsibilities,
			recruitmentProcess: job.recruitmentProcess,
			apply: job.apply, // Already in block format
			status: "pending",
			statusUpdatedAt: new Date().toISOString(),
			userId: session.user.id,
			submittedAt: new Date().toISOString(),
		});

		console.log("Sanity create result:", result);

		return NextResponse.json({
			success: true,
			jobId: result._id,
			message: "Job submitted successfully and pending approval",
		});
	} catch (error) {
		console.error("Job submission error:", error);

		return NextResponse.json(
			{ error: "Failed to submit job" },
			{ status: 500 },
		);
	}
}
