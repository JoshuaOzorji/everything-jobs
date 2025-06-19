import { z } from "zod";

export const signInSchema = z.object({
	email: z
		.string()
		.trim()
		.email("Invalid email address")
		.min(5, "Email must be at least 5 characters")
		.max(255, "Email cannot exceed 255 characters"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(100, "Password cannot exceed 100 characters"),
});

export type SigninInput = z.infer<typeof signInSchema>;

export const validateSignin = async (requestData: any) => {
	try {
		const result = signInSchema.safeParse(requestData);
		if (!result.success) {
			return { success: false, errors: result.error.errors };
		}
		return { success: true, data: result.data };
	} catch (error) {
		return {
			success: false,
			errors: [{ message: "Validation error" }],
		};
	}
};
