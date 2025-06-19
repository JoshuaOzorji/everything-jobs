import * as z from "zod";

export const jobValidationSchema = z.object({
	title: z.string().min(1, "Job title is required"),
	summary: z.array(z.any()).min(1, "Job summary is required"),
	location: z.object({
		_ref: z.string().min(1, "Location is required"),
	}),
	jobType: z.object({
		_ref: z.string().min(1, "Job type is required"),
	}),
	education: z.object({
		_ref: z.string().min(1, "Education level is required"),
	}),
	jobField: z.object({
		_ref: z.string().min(1, "Job field is required"),
	}),
	level: z.object({
		_ref: z.string().min(1, "Experience level is required"),
	}),
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
	requirements: z
		.array(z.string())
		.min(1, "At least one requirement is needed"),
	responsibilities: z.array(z.string()).optional(),
	recruitmentProcess: z.array(z.string()).optional(),
	apply: z.array(z.any()).min(1, "Application instructions are required"),
});
