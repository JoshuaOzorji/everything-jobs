import JobSubmissionForm from "@/components/JobSubmitForm/JobSubmissionForm";

export const metadata = {
	title: "Post a Job | Everything Jobs",
	description: "Submit a new job listing",
};

export default function PostJobPage() {
	return (
		<div className='py-6'>
			<div className='max-w-4xl mx-auto px-4'>
				<h1 className='text-3xl font-bold text-center mb-8 font-poppins'>
					Post a New Job
				</h1>
				<JobSubmissionForm />
			</div>
		</div>
	);
}
