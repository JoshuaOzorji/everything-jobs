import { Suspense } from "react";
import JobSubmissionsTable from "@/components/JobSubmissions/JobSubmissionsTable";
import JobSubmissionsFilter from "@/components/JobSubmissions/JobSubmissionsFilter";
import { LoadingComponent } from "@/components/Loading";

export default function JobSubmissionsPage() {
	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-4'>
				<h1 className='text-2xl font-semibold tracking-tight'>
					Job Submissions
				</h1>
				<p className='text-sm text-muted-foreground'>
					View and manage your job submissions
					here.
				</p>
			</div>

			<Suspense fallback={<LoadingComponent />}>
				<JobSubmissionsFilter />
				<JobSubmissionsTable />
			</Suspense>
		</div>
	);
}
