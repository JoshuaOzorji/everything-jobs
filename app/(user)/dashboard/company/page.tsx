// import { Suspense } from "react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/config";
// import { redirect } from "next/navigation";
// import { LoadingComponent } from "@/components/Loading";
// import CompanyProfileForm from "@/components/Company/CompanyProfileForm";

// export default async function CompanyCreatePage() {
// 	const session = await getServerSession(authOptions);

// 	if (!session?.user) {
// 		redirect("/auth/login");
// 	}

// 	if (session.user.companyId) {
// 		redirect("/dashboard/company-profile");
// 	}

// 	return (
// 		<div className='dashboard-page-container'>
// 			<Suspense fallback={<LoadingComponent />}>
// 				<CompanyProfileForm />
// 			</Suspense>
// 		</div>
// 	);
// }

// app/(user)/dashboard/company/page.tsx

import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";
import CompanyProfileForm from "@/components/Company/CompanyProfileForm";
import { redirect } from "next/navigation";
import {
	requireAuthentication,
	getUserCompanyData,
} from "@/lib/companyProfileUtils";

export default async function CompanyCreatePage() {
	const { redirect: redirectPath, session } =
		await requireAuthentication();

	if (redirectPath) {
		redirect(redirectPath);
	}

	// Check if user already has a company profile
	const { user, companyData } = await getUserCompanyData(
		session!.user.email,
	);

	if (user?.companyId && companyData) {
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
