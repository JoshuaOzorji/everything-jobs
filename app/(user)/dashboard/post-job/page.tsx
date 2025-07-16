import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";
import { redirect } from "next/navigation";
import { checkCompanyProfile } from "@/lib/companyProfileUtils";
import JobPostForm from "@/components/JobPost/JobPostForm";
import CompanyRequiredMessage from "@/components/JobPost/CompanyRequiredMessage";

export default async function PostJobPage() {
	const { requiresAuth, hasCompany } = await checkCompanyProfile();

	// If user is not authenticated, redirect to login
	if (requiresAuth) {
		redirect("/auth/login");
	}

	// If user doesn't have a company profile, show the message component
	if (!hasCompany) {
		return (
			<CompanyRequiredMessage
				title='Company Profile Required'
				message='You need to create a company profile before you can post jobs. This helps job seekers learn more about your organization.'
			/>
		);
	}

	// If user has a company profile, show the job post form
	return (
		<div className='dashboard-page-container'>
			<Suspense fallback={<LoadingComponent />}>
				<JobPostForm />
			</Suspense>
		</div>
	);
}
