import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";
import CompanyProfileForm from "@/components/Company/CompanyProfileForm";
import { redirect } from "next/navigation";
import { requireCompanyProfile } from "@/lib/companyProfileUtils";

export default async function CompanyProfilePage() {
	const { redirect: redirectPath, companyData } =
		await requireCompanyProfile();

	if (redirectPath) {
		redirect(redirectPath);
	}

	return (
		<div className='dashboard-page-container'>
			<Suspense fallback={<LoadingComponent />}>
				<CompanyProfileForm
					initialData={companyData ?? undefined}
				/>
			</Suspense>
		</div>
	);
}
