import JobPostForm from "@/components/JobPost/JobPostForm";

export default function PostJobPage() {
	return (
		<div className='max-w-4xl mx-auto p-6'>
			<div className='mb-6'>
				<h1 className='text-2xl font-semibold'>
					Post a New Job
				</h1>
				<p className='text-muted-foreground'>
					Fill in the details below to create a
					new job posting
				</p>
			</div>
			<JobPostForm />
		</div>
	);
}
