import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { LoadingComponent } from "@/components/Loading";
import CompanyProfileForm from "@/components/Company/CompanyProfileForm";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongoClient";

async function getCompanyData(companyId: string | undefined) {
	if (!companyId) {
		return null;
	}

	try {
		return await client.fetch(
			`*[_type == "company" && _id == $companyId][0]{
        _id,
        name,
        website,
        "industry": industry->{_id, name},
        description,
        logo
      }`,
			{ companyId },
		);
	} catch (error) {
		console.error("Error fetching company data:", error);
		return null;
	}
}

export default async function CompanyProfilePage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/auth/login");
	}

	// Fetch user from MongoDB to get the latest companyId
	const db = (await clientPromise).db();
	const user = await db
		.collection("users")
		.findOne({ email: session.user.email });

	const companyData = await getCompanyData(user?.companyId);

	if (!companyData && user?.role === "employer") {
		redirect("/dashboard/company");
	}

	return (
		<div className='dashboard-page-container'>
			<Suspense fallback={<LoadingComponent />}>
				<CompanyProfileForm initialData={companyData} />
			</Suspense>
		</div>
	);
}
