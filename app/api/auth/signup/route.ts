import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { validateUser } from "@/validations/userValidator";

export async function POST(req: Request) {
	// Connect to database
	await dbConnect();

	// Parse the request body
	let requestData;
	try {
		requestData = await req.json();
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	// Validate the input using Zod
	const validationResult = await validateUser(requestData);
	if (!validationResult.success) {
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
	try {
		await newUser.save();
		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 },
		);
	}
}
