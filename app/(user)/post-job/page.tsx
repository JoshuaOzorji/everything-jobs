import JobSubmissionForm from "@/components/JobSubmissionForm";

export const metadata = {
	title: "Post a Job | Everything Jobs",
	description: "Submit a new job listing",
};

export default function PostJobPage() {
	return (
		<div className='py-8'>
			<div className='max-w-4xl mx-auto px-4'>
				<h1 className='text-3xl font-bold text-center mb-8'>
					Post a New Job
				</h1>
				<JobSubmissionForm />
			</div>
		</div>
	);
}
