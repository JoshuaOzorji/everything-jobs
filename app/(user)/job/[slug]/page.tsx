import { groq, defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Job } from "@/types";

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
	// Fetch the job data using client.fetch()
	const job: Job | null = await client.fetch(jobQuery, { slug });

	if (!job) {
		return <div>Job not found.</div>;
	}

	return (
		<div
			style={{
				padding: "2rem",
				maxWidth: "800px",
				margin: "0 auto",
			}}>
			<h1>{job.title}</h1>

			<section>
				<h2>Summary</h2>
				<PortableText value={job.summary} />
			</section>

			<section>
				<h3>Details</h3>
				<p>
					<strong>Company:</strong>{" "}
					{job.company.name}
				</p>
				<p>
					<strong>Location:</strong>{" "}
					{job.location.name}
				</p>
				<p>
					<strong>Job Type:</strong>{" "}
					{job.jobType.name}
				</p>
				<p>
					<strong>Qualification:</strong>{" "}
					{job.qualification?.title}
				</p>
				<p>
					<strong>Job Field:</strong>{" "}
					{job.jobField.name}
				</p>
				<p>
					<strong>Salary Range:</strong>{" "}
					{job.salaryRange.min} -{" "}
					{job.salaryRange.max}
				</p>
				<p>
					<strong>Published At:</strong>{" "}
					{new Date(
						job.publishedAt,
					).toLocaleDateString()}
				</p>
				<p>
					<strong>Deadline:</strong>{" "}
					{new Date(
						job.deadline,
					).toLocaleDateString()}
				</p>
				<p>
					<strong>Experience Level:</strong>{" "}
					{job.level.name}
				</p>
				<p>
					<strong>Experience Range:</strong>{" "}
					{job.experienceRange.min} -{" "}
					{job.experienceRange.max} years
				</p>
			</section>

			<section>
				<h3>Requirements</h3>
				<ul>
					{job.requirements.map((req, index) => (
						<li key={index}>{req}</li>
					))}
				</ul>
			</section>

			{job.responsibilities &&
				job.responsibilities.length > 0 && (
					<section>
						<h3>Responsibilities</h3>
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

			<section>
				<h3>Recruitment Process</h3>
				<ul>
					{job.recruitmentProcess.map(
						(step, index) => (
							<li key={index}>
								{step}
							</li>
						),
					)}
				</ul>
			</section>

			{job.mainImage && job.mainImage.asset && (
				<section>
					<h3>Job Image</h3>
					<Image
						src={job.mainImage.asset.url}
						alt={
							job.mainImage.alt ||
							"Job Image"
						}
						width={800}
						height={400}
						style={{ objectFit: "cover" }}
					/>
				</section>
			)}

			<section>
				<h3>How to Apply</h3>
				<PortableText value={job.apply} />
			</section>
		</div>
	);
}
