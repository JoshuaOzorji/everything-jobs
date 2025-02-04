import { z } from "zod";

export const userSchema = z
	.object({
		firstName: z
			.string()
			.trim()
			.min(2, "First name must be at least 2 characters")
			.max(50, "First name cannot exceed 50 characters")
			.regex(
				/^[a-zA-Z\s'-]*$/,
				"First name can only contain letters, spaces, hyphens, and apostrophes",
			),

		lastName: z
			.string()
			.trim()
			.min(2, "Last name must be at least 2 characters")
			.max(50, "Last name cannot exceed 50 characters")
			.regex(
				/^[a-zA-Z\s'-]*$/,
				"Last name can only contain letters, spaces, hyphens, and apostrophes",
			),

		username: z
			.string()
			.trim()
			.min(3, "Username must be at least 3 characters")
			.max(30, "Username cannot exceed 30 characters")
			.regex(
				/^[a-zA-Z0-9_]*$/,
				"Username can only contain letters, numbers, and underscores",
			),

		email: z
			.string()
			.trim()
			.email("Invalid email address")
			.min(5, "Email must be at least 5 characters")
			.max(255, "Email cannot exceed 255 characters")
			.toLowerCase(),

		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(100, "Password cannot exceed 100 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			),

		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type UserInput = z.infer<typeof userSchema>;

export const validateUser = async (data: unknown) => {
	const result = userSchema.safeParse(data);

	if (!result.success) {
		const errors = result.error.errors.map((error) => ({
			field: error.path.join("."),
			message: error.message,
		}));

		return { success: false, errors };
	}

	return { success: true, data: result.data };
};
