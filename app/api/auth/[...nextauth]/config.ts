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

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: string;
			companyId?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			submitterInfo?: {
				name: string;
				email: string;
			};
		};
	}
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
		async jwt({ token, user, account, profile }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.role = (user as any).role;
				token.companyId = (user as any).companyId;

				// Better name handling - fetch from database if needed
				let firstName = (user as any).firstName;
				let lastName = (user as any).lastName;

				// If firstName/lastName are not available, try to get them from database
				if (!firstName || !lastName) {
					try {
						await dbConnect();
						const dbUser =
							await User.findById(
								user.id,
							);
						if (dbUser) {
							firstName =
								dbUser.firstName ||
								firstName;
							lastName =
								dbUser.lastName ||
								lastName;
						}
					} catch (error) {
						console.error(
							"Error fetching user from database:",
							error,
						);
					}
				}

				// Construct name with fallbacks
				const fullName =
					firstName && lastName
						? `${firstName} ${lastName}`.trim()
						: user.name ||
							user.email?.split(
								"@",
							)[0] ||
							"User";

				token.name = fullName;
				token.submitterInfo = {
					name: fullName,
					email: user.email || "",
				};
			}
			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email;
				session.user.role = token.role as string;
				session.user.companyId =
					token.companyId as string;
				session.user.name = token.name as string;
				session.user.submitterInfo =
					token.submitterInfo as {
						name: string;
						email: string;
					};
			}
			return session;
		},

		async signIn({ user, account, profile }) {
			if (account?.provider === "credentials") {
				return true;
			}

			await dbConnect();
			const existingUser = await User.findOne({
				email: user.email,
			});

			if (!existingUser) {
				// Create new user with enhanced profile info
				const userData = {
					email: user.email,
					provider: account?.provider,
					image: user.image,
					role: "employer",
					firstName:
						account?.provider === "linkedin"
							? (profile as any)
									.firstName
							: user.name?.split(
									" ",
								)[0] || "",
					lastName:
						account?.provider === "linkedin"
							? (profile as any)
									.lastName
							: user.name
									?.split(
										" ",
									)
									.slice(
										1,
									)
									.join(
										" ",
									) || "",
					username:
						user.email?.split("@")[0] || "",
				};

				await User.create(userData);
			}

			return true;
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
