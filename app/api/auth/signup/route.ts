import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

export async function POST(req: Request) {
	await dbConnect();
	const { name, email, password } = await req.json();

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return NextResponse.json(
			{ error: "User already exists" },
			{ status: 400 },
		);
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({ name, email, password: hashedPassword });

	await newUser.save();
	return NextResponse.json(
		{ message: "User created successfully" },
		{ status: 201 },
	);
}
