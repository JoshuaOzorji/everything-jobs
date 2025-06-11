import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";

interface UserData {
	email: string | null | undefined;
	provider: string | undefined;
	image: string | null | undefined;
	role: string;
	firstName: string;
	lastName: string;
	username: string;
}

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
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					scope: "openid profile email",
				},
			},
			issuer: "https://www.linkedin.com/oauth",
			jwks_endpoint:
				"https://www.linkedin.com/oauth/openid/jwks",

			async profile(profile) {
				const [firstName, ...lastNameArr] = (
					profile.name || ""
				).split(" ");
				return {
					id: profile.sub,
					firstName: firstName || "",
					lastName: lastNameArr.join(" ") || "",
					username: profile.email
						? profile.email.split("@")[0]
						: profile.sub,
					email: profile.email,
					image: profile.picture,
					role: "employer",
				};
			},
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
				let userData: UserData = {
					email: user.email,
					provider: account?.provider,
					image: user.image,
					role: "employer",
					firstName: "",
					lastName: "",
					username: "",
				};

				if (account?.provider === "linkedin") {
					userData = {
						...userData,
						firstName: (user as any)
							.firstName,
						lastName: (user as any)
							.lastName,
						username: (user as any)
							.username,
					};
				} else {
					userData = {
						...userData,
						firstName:
							user.name?.split(
								" ",
							)[0] || "",
						lastName:
							user.name
								?.split(" ")
								.slice(1)
								.join(" ") ||
							"",
						username:
							user.email?.split(
								"@",
							)[0] || "",
					};
				}

				const newUser = await User.create(userData);
				return true;
			}

			// Update existing user's provider info
			await User.findOneAndUpdate(
				{ email: user.email },
				{
					$set: {
						provider: account?.provider,
						image: user.image,
					},
				},
			);

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
