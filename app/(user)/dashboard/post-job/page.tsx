import JobPostForm from "@/components/JobPost/JobPostForm";

export default function PostJobPage() {
	return (
		<div className='dashboard-page-container'>
			<div className='mb-6'>
				<p className='text-sm italic font-light text-muted-foreground'>
					Fill in the details below to create a
					new job posting
				</p>
			</div>
			<JobPostForm />
		</div>
	);
}
