import { Suspense } from "react";
import JobSubmissionsTable from "@/components/JobSubmissions/JobSubmissionsTable";
import JobSubmissionsFilter from "@/components/JobSubmissions/JobSubmissionsFilter";
import { LoadingComponent } from "@/components/Loading";

export default function JobSubmissionsPage() {
	return (
		<div className='space-y-4 p-4'>
			<h1 className='text-2xl font-semibold'>
				Job Submissions
			</h1>

			<Suspense fallback={<LoadingComponent />}>
				<JobSubmissionsFilter />
				<JobSubmissionsTable />
			</Suspense>
		</div>
	);
}
