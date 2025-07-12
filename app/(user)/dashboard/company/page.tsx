import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { redirect } from "next/navigation";
import { LoadingComponent } from "@/components/Loading";
import CompanyProfileForm from "@/components/Company/CompanyProfileForm";

export default async function CompanyCreatePage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/auth/login");
	}

	if (session.user.companyId) {
		redirect("/dashboard/company-profile");
	}

	return (
		<div className='dashboard-page-container'>
			<Suspense fallback={<LoadingComponent />}>
				<CompanyProfileForm />
			</Suspense>
		</div>
	);
}
