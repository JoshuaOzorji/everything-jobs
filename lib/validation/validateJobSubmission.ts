import { JobDraft } from "@/lib/hooks/useJobDraft";

interface ValidationResult {
	success: boolean;
	error?: string;
}

export async function validateJobSubmission(
	data: JobDraft,
): Promise<ValidationResult> {
	try {
		// Basic required fields
		if (!data.title?.trim()) {
			return {
				success: false,
				error: "Job title is required",
			};
		}

		if (!data.summary?.length) {
			return {
				success: false,
				error: "Job summary is required",
			};
		}

		type ReferenceField = keyof Pick<
			JobDraft,
			"location" | "jobType" | "education" | "jobField" | "level"
		>;

		const requiredRefs: Array<{ field: ReferenceField; name: string }> = [
			{ field: "location", name: "Location" },
			{ field: "jobType", name: "Job type" },
			{ field: "education", name: "Education level" },
			{ field: "jobField", name: "Job field" },
			{ field: "level", name: "Experience level" },
		];

		for (const ref of requiredRefs) {
			if (!data[ref.field]?._ref) {
				return {
					success: false,
					error: `${ref.name} is required`,
				};
			}
		}

		// Validate salary range
		if (data.salaryRange) {
			const { min, max } = data.salaryRange;
			if (min > max) {
				return {
					success: false,
					error: "Maximum salary must be greater than minimum salary",
				};
			}
		}

		// Validate deadline if provided
		if (data.deadline) {
			const deadlineDate = new Date(data.deadline);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (deadlineDate < today) {
				return {
					success: false,
					error: "Deadline must be in the future",
				};
			}
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				"Validation failed: " +
				(error instanceof Error
					? error.message
					: "Unknown error"),
		};
	}
}
