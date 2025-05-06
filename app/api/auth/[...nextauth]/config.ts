import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";

export const authOptions: AuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: {
					label: "Password",
					type: "password",
				},
			},
			async authorize(credentials) {
				await dbConnect();

				const user = await User.findOne({
					email: credentials?.email,
				});

				if (!user) throw new Error("No user found");

				const isValid = await bcrypt.compare(
					credentials!.password,
					user.password,
				);
				if (!isValid)
					throw new Error("Invalid credentials");

				return user;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/sign-in",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
