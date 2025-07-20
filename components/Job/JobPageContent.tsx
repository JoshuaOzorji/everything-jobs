import { Suspense } from "react";
import { Job, RelatedJob } from "@/types/types";
import JobHeader from "./JobHeader";
import JobBasicInfo from "./JobBasicInfo";
import RelatedJobs from "@/components/RelatedJobs";
import JobDetails from "@/components/JobDetails";

interface JobPageContentProps {
	job: Job;
	imageUrl: string;
	relatedJobs: RelatedJob[];
}

export default function JobPageContent({
	job,
	imageUrl,
	relatedJobs,
}: JobPageContentProps) {
	return (
		<div className='p-4 bg-white rounded-md font-openSans text-myBlack md:p-8'>
			<section className='pb-4 mb-4 border-b border-zinc-300'>
				<JobHeader job={job} imageUrl={imageUrl} />

				<h1 className='mt-6 mb-2 text-xl font-bold md:text-3xl font-poppins text-pry'>
					{job.title}
				</h1>

				<JobBasicInfo job={job} />
			</section>

			<Suspense fallback={<div>Loading job details...</div>}>
				<JobDetails job={job} />
			</Suspense>

			{relatedJobs && relatedJobs.length > 0 && (
				<RelatedJobs jobs={relatedJobs} />
			)}
		</div>
	);
}
