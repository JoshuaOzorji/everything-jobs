import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";

export const authOptions: AuthOptions = {
	adapter: MongoDBAdapter(clientPromise) as any,

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true,
		}),

		LinkedInProvider({
			clientId: process.env.LINKEDIN_CLIENT_ID!,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
		}),

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

				if (!user.password) {
					throw new Error(
						"Please login with your social provider",
					);
				}

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

	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === "credentials") {
				return true;
			}

			await dbConnect();

			const existingUser = await User.findOne({
				email: user.email,
			});

			if (!existingUser) {
				const newUser = await User.create({
					email: user.email,
					firstName:
						user.name?.split(" ")[0] || "",
					lastName:
						user.name
							?.split(" ")
							.slice(1)
							.join(" ") || "",
					username:
						user.email?.split("@")[0] || "",
					provider: account?.provider,
					image: user.image,
					role: "employer",
				});
				return true;
			}

			return true;
		},

		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.sub as string;
				session.user.role = token.role;
				session.user.companyId = token.companyId;
			}
			return session;
		},

		async jwt({ token, user }) {
			if (user) {
				token.role = (user as any).role;
				token.companyId = (user as any).companyId;
			}
			return token;
		},
	},

	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},

	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},

	secret: process.env.NEXTAUTH_SECRET,
};
