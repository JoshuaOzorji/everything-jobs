"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchRelatedJobs } from "@/sanity/lib/queries";
import { Job } from "@/types";
interface RelatedJobsProps {
	currentJob: Job;
}

export interface RelatedJob {
	_id: string;
	title: string;
	slug: string;
	company: string;
	companyLogo?: string;
	location: string;
	jobType: string;
	publishedAt: string;
}

export default function RelatedJobs({ currentJob }: RelatedJobsProps) {
	const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadRelatedJobs() {
			try {
				if (currentJob) {
					const jobs =
						await fetchRelatedJobs(
							currentJob,
						);
					setRelatedJobs(jobs);
				}
			} catch (error) {
				console.error(
					"Failed to fetch related jobs:",
					error,
				);
			} finally {
				setIsLoading(false);
			}
		}

		loadRelatedJobs();
	}, [currentJob]);

	if (isLoading) {
		return (
			<div className='animate-pulse h-48 bg-gray-100 rounded-md'></div>
		);
	}

	if (relatedJobs.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby='related-jobs-heading'
			className='mt-12'>
			<h2
				id='related-jobs-heading'
				className='text-2xl font-bold mb-6'>
				Similar Jobs You Might Like
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
				{relatedJobs.map((job) => (
					<Link
						href={`/jobs/${job.slug}`}
						key={job._id}
						className='group'>
						<article className='h-full border rounded-lg p-4 transition-shadow hover:shadow-md flex flex-col'>
							<div className='flex items-center mb-3'>
								{job.companyLogo && (
									<div className='w-10 h-10 relative mr-3 flex-shrink-0'>
										<Image
											src={
												job.companyLogo
											}
											alt={`${job.company} logo`}
											fill
											className='object-contain'
											sizes='40px'
										/>
									</div>
								)}
								<h3 className='font-medium line-clamp-1 group-hover:text-blue-600 transition-colors'>
									{
										job.title
									}
								</h3>
							</div>

							<div className='text-sm text-gray-600 mb-2'>
								{job.company}
							</div>

							<div className='mt-auto'>
								<div className='flex flex-wrap gap-2 mb-2'>
									<span className='inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded'>
										{
											job.jobType
										}
									</span>
									<span className='inline-block px-2 py-1 text-xs bg-green-50 text-green-700 rounded'>
										{
											job.location
										}
									</span>
								</div>

								<div className='text-xs text-gray-500'>
									Posted:{" "}
									{new Date(
										job.publishedAt,
									).toLocaleDateString()}
								</div>
							</div>
						</article>
					</Link>
				))}
			</div>
		</section>
	);
}
