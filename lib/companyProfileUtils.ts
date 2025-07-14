import { client } from "@/sanity/lib/client";
import clientPromise from "@/lib/mongoClient";
import { getEnhancedSession } from "@/lib/sessionUtils";

export interface CompanyProfileData {
	_id: string;
	name: string;
	website?: string;
	industry?: { _id: string; name?: string };
	description?: string;
	logo?: any;
}

// Optimized version that uses enhanced session
export async function getUserCompanyData(userEmail: string | null | undefined) {
	if (!userEmail) {
		return { user: null, companyData: null };
	}

	try {
		// Fetch user from MongoDB
		const db = (await clientPromise).db();
		const user = await db
			.collection("users")
			.findOne({ email: userEmail });

		if (!user?.companyId) {
			return { user, companyData: null };
		}

		// Fetch company data from Sanity
		const companyData = await client.fetch<CompanyProfileData>(
			`*[_type == "company" && _id == $companyId][0]{
        _id,
        name,
        website,
        "industry": industry->{_id, name},
        description,
        logo
      }`,
			{ companyId: user.companyId },
		);

		return { user, companyData };
	} catch (error) {
		console.error("Error fetching user company data:", error);
		return { user: null, companyData: null };
	}
}

// Simplified functions using enhanced session
export async function requireCompanyProfile() {
	const session = await getEnhancedSession();

	if (!session) {
		return {
			redirect: "/auth/login",
			user: null,
			companyData: null,
		};
	}

	// Check if user has company profile
	if (!session.user.hasCompany) {
		return {
			redirect: "/dashboard/company",
			user: session.user,
			companyData: null,
		};
	}

	return {
		redirect: null,
		user: session.user,
		companyData: session.user.companyData,
	};
}

export async function requireAuthentication() {
	const session = await getEnhancedSession();

	if (!session) {
		return {
			redirect: "/auth/login",
			session: null,
		};
	}

	return {
		redirect: null,
		session,
	};
}

export async function checkCompanyProfile() {
	const session = await getEnhancedSession();

	if (!session) {
		return {
			requiresAuth: true,
			hasCompany: false,
			user: null,
			companyData: null,
		};
	}

	return {
		requiresAuth: false,
		hasCompany: session.user.hasCompany,
		user: session.user,
		companyData: session.user.companyData,
	};
}
