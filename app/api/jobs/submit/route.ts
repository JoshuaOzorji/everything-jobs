import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { JobSubmission } from "@/types";

interface PortableTextSpan {
	_type: "span";
	_key?: string;
	text: string;
}

interface PortableTextBlock {
	_type: "block";
	_key?: string;
	children?: PortableTextSpan[];
}

//generate unique keys
function generateKey(length: number = 12): string {
	return Math.random()
		.toString(36)
		.substring(2, 2 + length);
}

function ensureArray(value: any): any[] {
	if (!value) return [];
	if (Array.isArray(value)) return value;
	if (typeof value === "string") return [value];
	return [];
}
export async function POST(request: Request) {
	try {
		const job: JobSubmission = await request.json();

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
			// Convert summary to proper Portable Text format if it's a string
			summary:
				typeof job.summary === "string"
					? [
							{
								_type: "block",
								_key: generateKey(),
								children: [
									{
										_type: "span",
										_key: generateKey(),
										text: job.summary,
									} as PortableTextSpan,
								],
							} as PortableTextBlock,
						]
					: Array.isArray(job.summary)
						? job.summary.map(
								(
									block: PortableTextBlock,
								) => ({
									...block,
									_key:
										block._key ||
										generateKey(),
									children: block.children?.map(
										(
											child: PortableTextSpan,
										) => ({
											...child,
											_key:
												child._key ||
												generateKey(),
										}),
									),
								}),
							)
						: [],

			locationName: job.locationName,
			jobTypeName: job.jobTypeName,
			educationLevel: job.educationLevel,
			jobFieldName: job.jobFieldName,
			experienceLevel: job.experienceLevel,
			salaryRange: {
				min: Number(job.salaryRange?.min) || 0,
				max: Number(job.salaryRange?.max) || 0,
			},
			experienceRange: {
				min: Number(job.experienceRange?.min) || 0,
				max: Number(job.experienceRange?.max) || 0,
			},
			// Ensure arrays and clean up strings
			requirements: ensureArray(job.requirements).map(
				(req) =>
					typeof req === "string"
						? req
								.replace(
									/[\r\n]+/g,
									" ",
								)
								.trim()
						: req,
			),
			responsibilities: ensureArray(job.responsibilities).map(
				(resp) =>
					typeof resp === "string"
						? resp
								.replace(
									/[\r\n]+/g,
									" ",
								)
								.trim()
						: resp,
			),
			recruitmentProcess: ensureArray(
				job.recruitmentProcess,
			).map((proc) =>
				typeof proc === "string"
					? proc.replace(/[\r\n]+/g, " ").trim()
					: proc,
			),
			status: "pending",
			submitterInfo: {
				name: job.submitterInfo.name,
				email: job.submitterInfo.email,
				phoneNumber: job.submitterInfo.phoneNumber,
			},
			submittedAt: new Date().toISOString(),
		});

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
