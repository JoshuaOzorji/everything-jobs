import { groq, defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Job } from "@/types";
import SubLayout from "@/components/SubLayout";
import AsideComponent from "@/components/AsideComponent";

const jobQuery = defineQuery(groq`
  *[_type == "job" && slug.current == $slug][0]{
    title,
    summary,
    company-> { name },
    location-> { name },
    jobType-> { name },
    qualification-> { title },
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

	console.log(job.location.name);
	return (
		<main>
			<SubLayout aside={<AsideComponent />}>
				<section className='font-openSans text-myBlack bg-white p-4 rounded-md'>
					<h1 className='font-poppins font-bold text-xl'>
						{job.title}
					</h1>

					<div className='flex gap-2 items-center'>
						{job.company?.name && (
							<p>
								{
									job
										.company
										.name
								}
							</p>
						)}
						<p>{job.location?.name}</p>
					</div>
					<div>
						<h3>Details</h3>

						{job.jobType?.name && (
							<p>
								<strong>
									Job
									Type:
								</strong>{" "}
								{
									job
										.jobType
										.name
								}
							</p>
						)}
						{job.qualification?.title && (
							<p>
								<strong>
									Qualification:
								</strong>{" "}
								{
									job
										.qualification
										.title
								}
							</p>
						)}
						{job.jobField?.name && (
							<p>
								<strong>
									Job
									Field:
								</strong>{" "}
								{
									job
										.jobField
										.name
								}
							</p>
						)}
						{job.salaryRange?.min &&
							job.salaryRange
								?.max && (
								<p>
									<strong>
										Salary
										Range:
									</strong>{" "}
									{
										job
											.salaryRange
											.min
									}{" "}
									-{" "}
									{
										job
											.salaryRange
											.max
									}
								</p>
							)}
						{job.publishedAt && (
							<p>
								<strong>
									Published
									At:
								</strong>{" "}
								{new Date(
									job.publishedAt,
								).toLocaleDateString()}
							</p>
						)}
						{job.deadline && (
							<p>
								<strong>
									Deadline:
								</strong>{" "}
								{new Date(
									job.deadline,
								).toLocaleDateString()}
							</p>
						)}
						{job.level?.name && (
							<p>
								<strong>
									Experience
									Level:
								</strong>{" "}
								{job.level.name}
							</p>
						)}
						{job.experienceRange?.min &&
							job.experienceRange
								?.max && (
								<p>
									<strong>
										Experience
										Range:
									</strong>{" "}
									{
										job
											.experienceRange
											.min
									}{" "}
									-{" "}
									{
										job
											.experienceRange
											.max
									}{" "}
									years
								</p>
							)}
					</div>

					{job.requirements?.length > 0 && (
						<section>
							<h3>Requirements</h3>
							<ul>
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
						</section>
					)}

					{job.responsibilities?.length > 0 && (
						<section>
							<h3>
								Responsibilities
							</h3>
							<ul>
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
						</section>
					)}

					{job.recruitmentProcess?.length > 0 && (
						<section>
							<h3>
								Recruitment
								Process
							</h3>
							<ul>
								{job.recruitmentProcess.map(
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
						</section>
					)}

					{job.mainImage?.asset?.url && (
						<section>
							<h3>Job Image</h3>
							<Image
								src={
									job
										.mainImage
										.asset
										.url
								}
								alt={
									job
										.mainImage
										.alt ||
									"Job Image"
								}
								width={800}
								height={400}
								style={{
									objectFit: "cover",
								}}
							/>
						</section>
					)}

					{job.summary && (
						<section>
							<h2>Summary</h2>
							<PortableText
								value={
									job.summary
								}
							/>
						</section>
					)}

					{job.apply && (
						<section>
							<h3>How to Apply</h3>
							<PortableText
								value={
									job.apply
								}
							/>
						</section>
					)}
				</section>
			</SubLayout>
		</main>
	);
}
