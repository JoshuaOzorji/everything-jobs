import * as z from "zod";

export const jobValidationSchema = z.object({
	title: z.string().min(1, "Job title is required"),
	summary: z.string().min(1, "Job summary is required"),
	location: z.string().min(1, "Location is required"),
	jobType: z.string().min(1, "Job type is required"),
	education: z.string().min(1, "Education level is required"),
	jobField: z.string().min(1, "Job field is required"),
	level: z.string().min(1, "Experience level is required"),
	deadline: z.string().optional(),
	salaryRange: z
		.object({
			min: z
				.number()
				.min(0, "Minimum salary cannot be negative"),
			max: z
				.number()
				.min(0, "Maximum salary cannot be negative"),
		})
		.refine((data) => data.max >= data.min, {
			message: "Maximum salary must be greater than or equal to minimum salary",
			path: ["max"],
		}),
	requirements: z.string().min(1, "Requirements are required"),
	responsibilities: z.string().min(1, "Responsibilities are required"),
	recruitmentProcess: z
		.string()
		.min(1, "Recruitment process is required"),
	apply: z.string().min(1, "Application instructions are required"),
});
