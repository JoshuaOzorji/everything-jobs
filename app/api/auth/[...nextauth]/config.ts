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

// Helper function to extract names with fallbacks
const extractNames = (
	fullName: string | null | undefined,
	email: string | null | undefined,
) => {
	let firstName = "";
	let lastName = "";

	if (fullName && fullName.trim()) {
		const nameParts = fullName.trim().split(/\s+/);
		firstName = nameParts[0] || "";
		lastName = nameParts.slice(1).join(" ") || "";
	}

	// If we still don't have names, try to derive from email
	if (!firstName && email) {
		const emailPrefix = email.split("@")[0];
		// Split by common delimiters like dots, underscores, etc.
		const emailParts = emailPrefix.split(/[._-]/);
		firstName = emailParts[0] || emailPrefix;
		lastName = emailParts[1] || "User";
	}

	// Final fallbacks
	if (!firstName) firstName = "User";
	if (!lastName) lastName = "Account";

	return { firstName, lastName };
};

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
				console.log("LinkedIn profile data:", profile); // Debug log

				// Extract names with better fallback logic
				const { firstName, lastName } = extractNames(
					profile.name,
					profile.email,
				);

				return {
					id: profile.sub,
					firstName,
					lastName,
					username: profile.email
						? profile.email.split("@")[0]
						: `user_${profile.sub}`,
					email: profile.email,
					image: profile.picture,
					role: "employer",
					name: `${firstName} ${lastName}`.trim(),
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

			try {
				await dbConnect();
				const existingUser = await User.findOne({
					email: user.email,
				});

				if (!existingUser) {
					// Enhanced user data creation with proper fallbacks
					let firstName = "";
					let lastName = "";

					if (account?.provider === "linkedin") {
						// For LinkedIn, use the processed profile data
						firstName =
							(user as any)
								.firstName ||
							"";
						lastName =
							(user as any)
								.lastName || "";
					} else if (
						account?.provider === "google"
					) {
						// For Google, extract from user.name
						const extracted = extractNames(
							user.name,
							user.email,
						);
						firstName = extracted.firstName;
						lastName = extracted.lastName;
					}

					// Final fallback extraction if still empty
					if (!firstName || !lastName) {
						const extracted = extractNames(
							user.name,
							user.email,
						);
						firstName =
							firstName ||
							extracted.firstName;
						lastName =
							lastName ||
							extracted.lastName;
					}

					const userData = {
						email: user.email,
						provider: account?.provider,
						image: user.image,
						role: "employer",
						firstName,
						lastName,
						username:
							user.email?.split(
								"@",
							)[0] ||
							`user_${Date.now()}`,
					};

					console.log(
						"Creating user with data:",
						userData,
					); // Debug log

					await User.create(userData);
				}

				return true;
			} catch (error) {
				console.error(
					"Error in signIn callback:",
					error,
				);
				return false; // This will redirect to the error page
			}
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
