import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { JobSubmission } from "@/types";

export async function POST(request: Request) {
	try {
		const job: JobSubmission = await request.json();
		console.log("Received job data:", job); // Debug incoming data

		// Validate required fields
		if (
			!job.title ||
			!job.companyName ||
			!job.locationName ||
			!job.jobTypeName ||
			!job.educationLevel ||
			!job.jobFieldName ||
			!job.experienceLevel ||
			!job.submitterInfo?.email
		) {
			console.log("Validation failed:", {
				title: job.title,
				companyName: job.companyName,
				location: job.locationName,
				jobType: job.jobTypeName,
				education: job.educationLevel,
				jobField: job.jobFieldName,
				experienceLevel: job.experienceLevel,
				email: job.submitterInfo?.email,
			});
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Create pending job document with exact schema match
		const result = await client.create({
			_type: "pendingJob",
			title: job.title,
			companyName: job.companyName,
			summary: job.summary || [],
			locationName: job.locationName,
			jobTypeName: job.jobTypeName,
			educationLevel: job.educationLevel,
			jobFieldName: job.jobFieldName,
			experienceLevel: job.experienceLevel,
			salaryRange: {
				min: job.salaryRange?.min || 0,
				max: job.salaryRange?.max || 0,
			},
			experienceRange: {
				min: job.experienceRange?.min || 0,
				max: job.experienceRange?.max || 0,
			},
			requirements: job.requirements || [],
			responsibilities: job.responsibilities || [],
			recruitmentProcess: job.recruitmentProcess || [],
			status: "pending",
			submitterInfo: {
				name: job.submitterInfo.name,
				email: job.submitterInfo.email,
				phoneNumber: job.submitterInfo.phoneNumber,
			},
			submittedAt: new Date().toISOString(),
		});

		console.log("Created pending job:", result); // Debug successful creation

		return NextResponse.json({
			success: true,
			jobId: result._id,
			message: "Job submitted successfully and pending approval",
		});
	} catch (error: any) {
		console.error("Detailed error:", {
			message: error.message,
			details: error.details,
			response: error.response,
		});

		return NextResponse.json(
			{
				error: "Failed to submit job",
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
