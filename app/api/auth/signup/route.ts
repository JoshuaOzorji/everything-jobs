import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { validateSignUp } from "@/validations/signUpValidator";
import logger from "@/lib/logger";

export async function POST(req: Request) {
	// Start tracking the request
	const requestId = Date.now().toString();
	logger.info(`[${requestId}] Signup request received`);

	try {
		// Connect to database
		await dbConnect();

		// Parse the request body
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

		// Validate the input using Zod
		const validationResult = await validateSignUp(requestData);
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

		const { firstName, lastName, email, username, password } =
			validationResult.data;

		// Check for existing user by email or username
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			const duplicateField =
				existingUser.email === email
					? "email"
					: "username";
			logger.warn(
				`[${requestId}] Duplicate ${duplicateField} attempt`,
				{
					email,
					username,
				},
			);
			return NextResponse.json(
				{
					error:
						existingUser.email === email
							? "Email already exists"
							: "Username already exists",
				},
				{ status: 400 },
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({
			firstName,
			lastName,
			email,
			username,
			password: hashedPassword,
		});

		// Save the user
		await newUser.save();

		logger.info(`[${requestId}] User created successfully`, {
			email,
			username,
		});

		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 },
		);
	} catch (error) {
		// Catch and log any unexpected errors
		logger.error(`[${requestId}] Unexpected error during signup`, {
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

// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/user";
// import { validateUser } from "@/validations/userValidator";

// export async function POST(req: Request) {
// 	// Connect to database
// 	await dbConnect();

// 	// Parse the request body
// 	let requestData;
// 	try {
// 		requestData = await req.json();
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Invalid request body" },
// 			{ status: 400 },
// 		);
// 	}

// 	// Validate the input using Zod
// 	const validationResult = await validateUser(requestData);
// 	if (!validationResult.success) {
// 		return NextResponse.json(
// 			{
// 				error: "Validation failed",
// 				details: validationResult.errors,
// 			},
// 			{ status: 400 },
// 		);
// 	}

// 	if (!validationResult.data) {
// 		return NextResponse.json(
// 			{ error: "Validation failed" },
// 			{ status: 400 },
// 		);
// 	}
// 	const { firstName, lastName, email, username, password } =
// 		validationResult.data;

// 	// Check for existing user by email or username
// 	const existingUser = await User.findOne({
// 		$or: [{ email }, { username }],
// 	});

// 	if (existingUser) {
// 		return NextResponse.json(
// 			{
// 				error:
// 					existingUser.email === email
// 						? "Email already exists"
// 						: "Username already exists",
// 			},
// 			{ status: 400 },
// 		);
// 	}

// 	// Hash the password
// 	const hashedPassword = await bcrypt.hash(password, 10);

// 	// Create new user
// 	const newUser = new User({
// 		firstName,
// 		lastName,
// 		email,
// 		username,
// 		password: hashedPassword,
// 	});

// 	// Save the user
// 	try {
// 		await newUser.save();
// 		return NextResponse.json(
// 			{ message: "User created successfully" },
// 			{ status: 201 },
// 		);
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Failed to create user" },
// 			{ status: 500 },
// 		);
// 	}
// }
