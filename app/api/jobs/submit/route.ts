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

		// Create pending job document
		const result = await client.create({
			_type: "pendingJob",
			title: job.title,
			company: {
				_type: "reference",
				_ref: session.user.companyId,
			},
			summary: job.summary,
			location: {
				_type: "reference",
				_ref: job.location,
			},
			jobType: {
				_type: "reference",
				_ref: job.jobType,
			},
			education: {
				_type: "reference",
				_ref: job.education,
			},
			jobField: {
				_type: "reference",
				_ref: job.jobField,
			},
			level: {
				_type: "reference",
				_ref: job.level,
			},
			deadline: job.deadline,
			salaryRange: job.salaryRange,
			requirements: job.requirements,
			responsibilities: job.responsibilities,
			recruitmentProcess: job.recruitmentProcess,
			apply: job.apply,
			status: "pending",
			statusUpdatedAt: new Date().toISOString(),
			userId: session.user.id,
			submittedAt: new Date().toISOString(),
		});

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
