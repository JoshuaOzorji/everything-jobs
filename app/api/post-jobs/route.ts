import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { client } from "@/sanity/lib/client";
import { authOptions } from "../auth/[...nextauth]/config";
import { validateJobSubmission } from "@/lib/validation/validateJobSubmission";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{
					error: "You must be logged in to submit a job",
				},
				{ status: 401 },
			);
		}

		if (!session.user.companyId) {
			return NextResponse.json(
				{
					error: "No company associated with this account",
				},
				{ status: 400 },
			);
		}

		const job = await request.json();

		// Validate the submission data
		const validationResult = await validateJobSubmission(job);
		if (!validationResult.success) {
			return NextResponse.json(
				{ error: validationResult.error },
				{ status: 400 },
			);
		}

		// Process arrays from text areas
		const requirements = job.requirements
			.split("\n")
			.filter((req: string) => req.trim());
		const responsibilities = job.responsibilities
			.split("\n")
			.filter((resp: string) => resp.trim());
		const recruitmentProcess = job.recruitmentProcess
			.split("\n")
			.filter((step: string) => step.trim());

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
			salaryRange: {
				min: parseInt(job.salaryRange.min),
				max: parseInt(job.salaryRange.max),
			},
			requirements,
			responsibilities,
			recruitmentProcess,
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
			{
				error: "Failed to submit job",
				details:
					error instanceof Error
						? error.message
						: "Unknown error",
			},
			{ status: 500 },
		);
	}
}
