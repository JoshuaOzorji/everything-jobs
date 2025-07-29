import { Suspense } from "react";
import JobSubmissionsTable from "@/components/JobSubmissions/JobSubmissionsTable";
import JobSubmissionsFilter from "@/components/JobSubmissions/JobSubmissionsFilter";
import { LoadingComponent } from "@/components/Loading";

export default function JobSubmissionsPage() {
	return (
		<div className='dashboard-post-job-heading'>
			<Suspense fallback={<LoadingComponent />}>
				<JobSubmissionsFilter />
				<JobSubmissionsTable />
			</Suspense>
		</div>
	);
}
