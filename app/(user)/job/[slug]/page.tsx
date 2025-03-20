import { groq, defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Job } from "@/types";
import SubLayout from "@/components/SubLayout";
import AsideComponent from "@/components/AsideComponent";
import placeholder from "@/public/placeholderCompany.png";
import { urlFor } from "@/sanity/lib/image";
import { ImLocation } from "react-icons/im";
import { IoIosCash } from "react-icons/io";
import { IoBriefcase } from "react-icons/io5";
import { PiBuildingsFill } from "react-icons/pi";
import { RiMedalFill } from "react-icons/ri";
import { CiCalendarDate } from "react-icons/ci";
import { formatDate } from "@/lib/formatDate";
import { RiUserStarFill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import { formatDate2 } from "@/lib/formatDate2";
import { FaRegCalendarXmark } from "react-icons/fa6";
const jobQuery = defineQuery(groq`
  *[_type == "job" && slug.current == $slug][0]{
    title,
    summary,
    company-> { 
			name,
      logo,
			"slug": slug.current, },
    location->{
      name,
      states,
			 "slug": slug.current 
    },
    jobType-> { name },
    qualification-> { name },
    jobField-> { name },
    salaryRange,
    publishedAt,
    deadline,
    level-> { name },
    experienceRange,
    requirements,
    responsibilities,
    recruitmentProcess,
    mainImage,
    apply
  }
`);

type PageProps = {
	params: {
		slug: string;
	};
};

export default async function JobPage({ params: { slug } }: PageProps) {
	const job: Job | null = await client.fetch(jobQuery, { slug });

	if (!job) {
		return <div>Job not found.</div>;
	}

	const imageUrl = job.company.logo?.asset?._ref
		? urlFor(job.company.logo).url()
		: placeholder;

	return (
		<>
			<SubLayout aside={<AsideComponent />}>
				<div className='p-4 bg-white rounded-md font-openSans text-myBlack md:p-8'>
					<section className='pb-4 mb-4 border-b border-zinc-300'>
						{/* COMPANY IMAGE & NAME */}
						<div className='flex items-center justify-between text-sm font-poppins md:text-base'>
							<div className='flex items-center gap-2'>
								<Image
									src={
										imageUrl
									}
									alt={
										job
											.company
											.name
									}
									className='h-[7vh] w-[7vh] rounded-sm'
									width={
										50
									}
									height={
										50
									}
								/>

								<p>
									{
										job
											.company
											.name
									}
								</p>
							</div>

							{job.publishedAt && (
								<p className='flex items-center gap-1 '>
									<CiCalendarDate />
									{formatDate(
										new Date(
											job.publishedAt,
										),
									)}
								</p>
							)}
						</div>

						{/* JOB TITLE */}
						<h1 className='mt-6 mb-2 font-bold ext-xl md:text-3xl font-poppins text-pry'>
							{job.title}
						</h1>

						<div className='space-y-1 font-poppins'>
							{/* LOCATION */}
							<div className='icon-container'>
								<ImLocation className='icon' />
								<span>
									Location:{" "}
								</span>
								<p>
									{Array.isArray(
										job
											.location
											?.states,
									)
										? job.location.states.join(
												", ",
											)
										: job
												.location
												?.states}
								</p>
							</div>

							<div>
								{(job
									.experienceRange
									?.min !=
									null ||
									job
										.experienceRange
										?.max !=
										null) && (
									<p className='icon-container2'>
										<RiMedalFill className='icon' />
										<span>
											Experience:
										</span>{" "}
										{job
											.experienceRange
											?.min ??
											0}{" "}
										-{" "}
										{job
											.experienceRange
											?.max ??
											0}

										+{" "}
										years
									</p>
								)}
							</div>

							{job.salaryRange?.min &&
								job.salaryRange
									?.max && (
									<div className='icon-container'>
										<IoIosCash className='icon' />
										<span>
											Pay:
										</span>
										<p>
											₦
											{job.salaryRange.min.toLocaleString()}{" "}
											-
											₦
											{job.salaryRange.max.toLocaleString()}
										</p>
									</div>
								)}

							<div className='icon-container'>
								<IoBriefcase className='icon' />
								<span>
									Job-Type:
								</span>
								{job.jobType
									?.name && (
									<p className='job-input'>
										{
											job
												.jobType
												.name
										}
									</p>
								)}
							</div>

							<div className='icon-container'>
								<PiBuildingsFill className='icon' />
								<span>
									Job
									Field:
								</span>
								{job.jobField
									?.name && (
									<p className='job-input'>
										{
											job
												.jobField
												.name
										}
									</p>
								)}
							</div>

							{job.level?.name && (
								<p className='icon-container2'>
									<RiUserStarFill className='icon' />
									<span>
										Career
										Levels:{" "}
									</span>
									<p className='job-input'>
										{
											job
												.level
												.name
										}
									</p>
								</p>
							)}
							{job.qualification
								?.name && (
								<div className='icon-container2'>
									<FaGraduationCap className='icon' />
									<span>
										Qualification:
									</span>{" "}
									<p className='job-input'>
										{
											job
												.qualification
												.name
										}
									</p>
								</div>
							)}
						</div>

						{/* DEADLINE */}
						<div className='flex justify-center w-full mt-4'>
							{job.deadline && (
								<p className='icon-container font-poppins'>
									<FaRegCalendarXmark className='text-red-500 ' />
									{new Date(
										job.deadline,
									) >
									new Date() ? (
										<>
											<span className='text-red-500'>
												Deadline:
											</span>{" "}
											{formatDate2(
												new Date(
													job.deadline,
												),
											)}
										</>
									) : (
										<span className='text-red-500'>
											Job
											Expired
										</span>
									)}
								</p>
							)}
						</div>
					</section>

					<section className='space-y-2 text-[0.9rem] md:text-base'>
						{/* SUMMARY */}
						{job.summary && (
							<div>
								<h2 className='job-h2'>
									Job
									Summary
								</h2>
								<PortableText
									value={
										job.summary
									}
								/>
							</div>
						)}

						{job.responsibilities?.length >
							0 && (
							<div>
								<h2 className='job-h2'>
									Job
									Responsibilities
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

						{job.requirements?.length >
							0 && (
							<div>
								<h2 className='job-h2'>
									Job
									Requirements
									/ Skills
								</h2>
								<ul className='list-disc list-inside'>
									{job.requirements.map(
										(
											req,
											index,
										) => (
											<li
												key={
													index
												}>
												{
													req
												}
											</li>
										),
									)}
								</ul>
							</div>
						)}

						{job.recruitmentProcess &&
							Array.isArray(
								job.recruitmentProcess,
							) &&
							job.recruitmentProcess.filter(
								(step) =>
									step &&
									step.trim()
										.length >
										0,
							).length > 0 && (
								<div>
									<span className='job-h2'>
										Recruitment
										Process
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

						{job.apply && (
							<div className='py-4 '>
								<h2 className='inline-block px-3 text-white rounded-md job-h2 bg-pry'>
									Apply
								</h2>
								<PortableText
									value={
										job.apply
									}
								/>
							</div>
						)}
					</section>
				</div>
			</SubLayout>
		</>
	);
}
