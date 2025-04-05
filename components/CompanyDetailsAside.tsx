import React from "react";
import Link from "next/link";
import { Company } from "@/types";
import {
	CalendarIcon,
	BriefcaseIcon,
	UsersIcon,
	BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { RiTwitterXFill } from "react-icons/ri";
import { BsFacebook } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import { RxExternalLink } from "react-icons/rx";
import { formatDate2 } from "@/lib/formatDate2";
interface CompanyDetailsAsideProps {
	company: Company;
}

export default function CompanyDetailsAside({
	company,
}: CompanyDetailsAsideProps) {
	// Get upcoming deadlines
	const upcomingDeadlines =
		company.jobs
			?.filter((job) => job.deadline)
			.sort(
				(a, b) =>
					new Date(a.deadline!).getTime() -
					new Date(b.deadline!).getTime(),
			)
			.slice(0, 3) || [];

	// Calculate the most recent job posting
	const mostRecentJob = company.jobs?.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() -
			new Date(a.publishedAt).getTime(),
	)[0];

	return (
		<div className='bg-white divide-y divide-gray-200 rounded-lg shadow font-openSans'>
			{/* Company stats section */}
			<div className='p-4'>
				<h3 className='mb-4 text-lg font-bold font-poppins'>
					Company Overview
				</h3>

				<div className='space-y-3'>
					{/* Industry */}
					{company.industry && (
						<div className='flex items-center'>
							<BuildingOfficeIcon className='company-aside-icon' />
							<div className='text-sm'>
								<span className='font-medium'>
									Industry:
								</span>{" "}
								<span className='capitalize'>
									{
										company
											.industry
											.name
									}
								</span>
							</div>
						</div>
					)}
					<div className='flex items-center'>
						<BriefcaseIcon className='company-aside-icon' />
						<span className='text-sm'>
							<span className='font-medium'>
								{company.jobs
									?.length ||
									0}
							</span>{" "}
							open positions
						</span>
					</div>

					{mostRecentJob && (
						<div className='flex items-center'>
							<CalendarIcon className='company-aside-icon' />
							<span className='text-sm'>
								Latest job
								posted on{" "}
								{formatDate2(
									new Date(
										mostRecentJob.publishedAt,
									),
								)}
							</span>
						</div>
					)}

					{company.website && (
						<div className='mt-3 '>
							<a
								href={
									company.website
								}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center text-sm text-pry2 hover:underline'>
								<RxExternalLink className='w-5 h-5 mr-2' />
								Visit website
							</a>
						</div>
					)}
				</div>
			</div>

			{/* Upcoming deadlines section */}
			{upcomingDeadlines.length > 0 && (
				<div className='p-4'>
					<h3 className='mb-3 font-medium font-poppins'>
						Upcoming Deadlines
					</h3>
					<ul className='space-y-3'>
						{upcomingDeadlines.map(
							(job) => (
								<li
									key={
										job._id
									}
									className='text-sm'>
									<Link
										href={`/jobs/${job.slug.current}`}
										className='hover:text-pry2'>
										<p className='font-medium'>
											{
												job.title
											}
										</p>
										<p className='mt-1 text-xs text-myBlack'>
											Deadline:{" "}
											{formatDate2(
												new Date(
													job.deadline!,
												),
											)}
										</p>
									</Link>
								</li>
							),
						)}
					</ul>
				</div>
			)}

			{/* Related links section */}
			<div className='p-4'>
				<h3 className='mb-3 font-medium font-poppins'>
					Explore More
				</h3>
				<ul className='space-y-2'>
					<li>
						<Link
							href='/companies'
							className='flex items-center text-sm text-pry2 hover:underline'>
							<UsersIcon className='w-4 h-4 mr-1' />
							All Companies
						</Link>
					</li>
					<li>
						<Link
							href='/search'
							className='flex items-center text-sm text-pry2 hover:underline'>
							<BriefcaseIcon className='w-4 h-4 mr-1' />
							All Jobs
						</Link>
					</li>
					{/* <li>
						<Link
							href='/search'
							className='flex items-center text-sm text-pry2 hover:underline'>
							<IoSearchOutline className='w-4 h-4 mr-1' />
							Advanced Job Search
						</Link>
					</li> */}
				</ul>
			</div>

			{/* Save or share section */}
			<div className='p-4'>
				<button className='flex items-center justify-center w-full gap-1 px-4 py-2 text-sm font-medium text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700'>
					<FiBookmark className='font-bold' />
					Save Company
				</button>

				<div className='flex justify-center mt-3 space-x-3'>
					<button className='p-1 text-myBlack hover:text-pry2'>
						<RiTwitterXFill />
					</button>
					<button className='p-1 text-myBlack hover:text-pry2'>
						<BsFacebook />
					</button>
					<button className='p-1 text-myBlack hover:text-pry2'>
						<FaLinkedin />
					</button>
				</div>
			</div>
		</div>
	);
}
