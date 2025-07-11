import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";
import { redirect } from "next/navigation";
import { requireCompanyProfile } from "@/lib/companyProfileUtils";
import JobPostForm from "@/components/JobPost/JobPostForm";

export default async function PostJobPage() {
	const { redirect: redirectPath, companyData } =
		await requireCompanyProfile();

	if (redirectPath) {
		redirect(redirectPath);
	}

	return (
		<div className='dashboard-page-container'>
			<div className='mb-6'>
				<p className='text-sm italic font-light text-muted-foreground'>
					Fill in the details below to create a
					new job posting for {companyData?.name}
				</p>
			</div>
			<Suspense fallback={<LoadingComponent />}>
				<JobPostForm />
			</Suspense>
		</div>
	);
}
