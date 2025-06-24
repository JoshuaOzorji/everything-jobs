import { Suspense } from "react";
import JobSubmissionsTable from "@/components/JobSubmissions/JobSubmissionsTable";
import JobSubmissionsFilter from "@/components/JobSubmissions/JobSubmissionsFilter";
import { LoadingComponent } from "@/components/Loading";

export default function JobSubmissionsPage() {
	return (
		<div className='dashboard-post-job-heading'>
			<div className='flex flex-col gap-4'>
				<p className='text-sm italic font-light text-muted-foreground'>
					View and manage your job submissions
					here
				</p>
			</div>

			<Suspense fallback={<LoadingComponent />}>
				<JobSubmissionsFilter />
				<JobSubmissionsTable />
			</Suspense>
		</div>
	);
}
