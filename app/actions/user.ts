import { validateUser } from "@/validations/userValidator";
import User from "@/models/user";

export async function createUser(formData: FormData) {
	// Convert FormData to a plain object
	const data = Object.fromEntries(formData);

	// Validate the input
	const validation = await validateUser(data);

	if (!validation.success) {
		return { error: validation.errors };
	}

	try {
		const user = await User.create(validation.data);
		return { success: true, user };
	} catch (error) {
		// Handle mongoose errors
		if ((error as any).code === 11000) {
			return {
				error: [
					{
						field: "email",
						message: "Email already exists",
					},
				],
			};
		}
		return {
			error: [
				{
					field: "general",
					message: "Something went wrong",
				},
			],
		};
	}
}
