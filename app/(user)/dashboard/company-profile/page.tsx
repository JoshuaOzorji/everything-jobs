import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { LoadingComponent } from "@/components/Loading";
import CompanyProfileForm from "@/components/Company/CompanyProfileForm";
import { redirect } from "next/navigation";

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
        "industry": industry->_id,
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

	const companyData = await getCompanyData(session?.user?.companyId);

	if (!companyData && session?.user?.role === "employer") {
		// Redirect to company creation page if employer has no company
		redirect("/dashboard/company/create");
	}

	return (
		<div className='dashboard-page-container'>
			<Suspense fallback={<LoadingComponent />}>
				<CompanyProfileForm initialData={companyData} />
			</Suspense>
		</div>
	);
}
