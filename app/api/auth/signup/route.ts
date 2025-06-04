import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

export async function POST(req: Request) {
	try {
		const { firstName, lastName, email, password } =
			await req.json();

		if (!firstName || !lastName || !email || !password) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 },
			);
		}

		await dbConnect();

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 },
			);
		}

		// Generate username from email
		const username = email.split("@")[0];

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user
		const user = await User.create({
			firstName,
			lastName,
			email,
			username,
			password: hashedPassword,
			role: "employer",
		});

		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 },
		);
	} catch (error: any) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
