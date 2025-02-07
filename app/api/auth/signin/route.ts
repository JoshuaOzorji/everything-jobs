import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { validateSignin } from "@/validations/signInValidator";
import logger from "@/lib/logger";

export async function POST(req: Request) {
	const requestId = Date.now().toString();
	logger.info(`[${requestId}] Signin request received`);

	try {
		await dbConnect();

		let requestData;
		try {
			requestData = await req.json();
			logger.info(
				`[${requestId}] Request body parsed successfully`,
			);
		} catch (error) {
			logger.error(`[${requestId}] Invalid request body`, {
				error:
					error instanceof Error
						? error.message
						: "Unknown error",
			});
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 },
			);
		}

		const validationResult = await validateSignin(requestData);
		if (!validationResult.success) {
			logger.warn(`[${requestId}] Validation failed`, {
				errors: validationResult.errors,
			});
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.errors,
				},
				{ status: 400 },
			);
		}

		if (!validationResult.data) {
			return NextResponse.json(
				{ error: "Validation failed" },
				{ status: 400 },
			);
		}
		const { email, password } = validationResult.data;

		const user = await User.findOne({ email });
		if (!user) {
			logger.warn(
				`[${requestId}] Invalid signin attempt - user not found`,
				{ email },
			);
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			user.password,
		);
		if (!isPasswordValid) {
			logger.warn(
				`[${requestId}] Invalid signin attempt - wrong password`,
				{ email },
			);
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		logger.info(`[${requestId}] User signed in successfully`, {
			email,
		});

		return NextResponse.json({
			user: {
				id: user._id,
				email: user.email,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
	} catch (error) {
		logger.error(`[${requestId}] Unexpected error during signin`, {
			error:
				error instanceof Error
					? error.message
					: "Unknown error",
			stack:
				error instanceof Error
					? error.stack
					: "No stack trace",
		});

		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
