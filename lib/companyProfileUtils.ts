// lib/utils/companyProfileUtils.ts

import { client } from "@/sanity/lib/client";
import clientPromise from "@/lib/mongoClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";

export interface CompanyProfileData {
	_id: string;
	name: string;
	website?: string;
	industry?: { _id: string; name?: string };
	description?: string;
	logo?: any;
}

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

export async function requireCompanyProfile() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return {
			redirect: "/auth/login",
			user: null,
			companyData: null,
		};
	}

	const { user, companyData } = await getUserCompanyData(
		session.user.email,
	);

	// If user has no companyId or companyData, redirect to create page
	if (!user?.companyId || !companyData) {
		return {
			redirect: "/dashboard/company",
			user,
			companyData: null,
		};
	}

	return {
		redirect: null,
		user,
		companyData,
	};
}

export async function requireAuthentication() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
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
