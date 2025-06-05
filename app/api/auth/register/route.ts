import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

export async function POST(req: Request) {
	try {
		const { firstName, lastName, email, password } =
			await req.json();

		// Enhanced input validation
		if (!email?.includes("@") || password?.length < 6) {
			return NextResponse.json(
				{
					message: "Invalid email or password must be at least 6 characters",
				},
				{ status: 400 },
			);
		}

		if (!firstName?.trim() || !lastName?.trim()) {
			return NextResponse.json(
				{
					message: "First and last name are required",
				},
				{ status: 400 },
			);
		}

		await dbConnect();

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [
				{ email: email.toLowerCase() },
				{ username: email.split("@")[0] },
			],
		});

		if (existingUser) {
			return NextResponse.json(
				{
					message: "Email or username already exists",
				},
				{ status: 409 },
			);
		}

		// Generate username and ensure it's unique
		const baseUsername = email.split("@")[0];
		let username = baseUsername;
		let counter = 1;

		while (await User.findOne({ username })) {
			username = `${baseUsername}${counter}`;
			counter++;
		}

		// Hash password with better salt rounds
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user with sanitized data
		const user = await User.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.toLowerCase(),
			username,
			password: hashedPassword,
			role: "employer",
			createdAt: new Date(),
		});

		return NextResponse.json(
			{
				message: "User created successfully",
				userId: user._id,
			},
			{ status: 201 },
		);
	} catch (error: any) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{
				message: "Registration failed",
				error: error.message,
			},
			{ status: 500 },
		);
	}
}
