import { PortableText } from "@portabletext/react";
import { Job } from "@/types/types";

export default function JobDetails({ job }: { job: Job }) {
	return (
		<section className='space-y-2 text-[0.9rem] md:text-base'>
			{/* SUMMARY */}
			{job.summary && (
				<div>
					<h2 className='job-h2'>Job Summary</h2>
					<PortableText value={job.summary} />
				</div>
			)}

			{/* RESPONSIBILITIES */}
			{job.responsibilities &&
				job.responsibilities.length > 0 && (
					<div>
						<h2 className='job-h2'>
							Job Responsibilities
						</h2>
						<ul className='list-disc list-inside'>
							{job.responsibilities.map(
								(
									res,
									index,
								) => (
									<li
										key={
											index
										}>
										{
											res
										}
									</li>
								),
							)}
						</ul>
					</div>
				)}

			{/* REQUIREMENTS */}
			{job.requirements && job.requirements.length > 0 && (
				<div>
					<h2 className='job-h2'>
						Job Requirements / Skills
					</h2>
					<ul className='list-disc list-inside'>
						{job.requirements.map(
							(req, index) => (
								<li key={index}>
									{req}
								</li>
							),
						)}
					</ul>
				</div>
			)}

			{/* RECRUITMENT PROCESS */}
			{job.recruitmentProcess &&
				Array.isArray(job.recruitmentProcess) &&
				job.recruitmentProcess.filter(
					(step) =>
						step && step.trim().length > 0,
				).length > 0 && (
					<div>
						<span className='job-h2'>
							Recruitment Process
						</span>
						<ul>
							{job.recruitmentProcess
								.filter(
									(
										step,
									) =>
										step &&
										step.trim()
											.length >
											0,
								)
								.map(
									(
										step,
										index,
									) => (
										<li
											key={
												index
											}>
											{
												step
											}
										</li>
									),
								)}
						</ul>
					</div>
				)}

			{/* APPLICATION INSTRUCTIONS */}
			{job.apply && (
				<div className='py-4'>
					<h2 className='inline-block px-3 text-white job-h2 bg-pry'>
						Apply for Job
					</h2>
					<PortableText value={job.apply} />
				</div>
			)}
		</section>
	);
}
