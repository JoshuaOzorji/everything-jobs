// app/companies/[slug]/page.tsx
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { Company, Job } from "@/types";

// Extend the Company type to include related jobs
interface CompanyWithJobs extends Company {
	jobs?: {
		_id: string;
		title: string;
		summary: any[];
		slug: { current: string };
		publishedAt: string;
		deadline?: string;
		jobType: { name: string };
		location: { name: string };
		level: { name: string };
	}[];
}

// Generate static params for commonly accessed companies
export async function generateStaticParams() {
	const query = groq`*[_type == "company"][0...10].slug.current`;
	const slugs = await client.fetch<string[]>(query);
	return slugs.map((slug) => ({ slug }));
}

// Company query with related jobs
const companyQuery = groq`
  *[_type == "company" && slug.current == $slug][0] {
    _id,
    name,
    logo {
      asset->,
      alt
    },
    description,
    slug,
    website,
    "jobs": *[_type == "job" && references(^._id)] {
      _id,
      title,
      summary,
      slug,
      publishedAt,
      deadline,
      jobType->{name},
      location->{name},
      level->{name}
    }
  }
`;

async function getCompany(slug: string) {
	return await client.fetch<CompanyWithJobs>(companyQuery, { slug });
}

export default async function CompanyDetailPage({
	params,
}: {
	params: { slug: string };
}) {
	const company = await getCompany(params.slug);

	if (!company) {
		notFound();
	}

	return (
		<div className='container mx-auto py-8 px-4'>
			<Link
				href='/companies'
				className='text-blue-600 hover:underline mb-6 inline-block'>
				← Back to Companies
			</Link>

			<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
				<div className='flex flex-col md:flex-row md:items-center gap-6'>
					<div className='flex-shrink-0 w-32 h-32 flex items-center justify-center bg-gray-100 rounded'>
						{company.logo?.asset ? (
							<Image
								src={urlFor(
									company.logo,
								)
									.width(
										200,
									)
									.height(
										200,
									)
									.url()}
								alt={
									company
										.logo
										.alt ||
									company.name
								}
								width={200}
								height={200}
								className='object-contain max-h-32'
							/>
						) : (
							<span className='text-gray-500 font-medium text-4xl'>
								{company.name.charAt(
									0,
								)}
							</span>
						)}
					</div>

					<div>
						<h1 className='text-3xl font-bold mb-2'>
							{company.name}
						</h1>
						{company.website && (
							<a
								href={
									company.website
								}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:underline mb-3 inline-block'>
								Visit Website
							</a>
						)}
						{company.description && (
							<p className='text-gray-700 mt-3'>
								{
									company.description
								}
							</p>
						)}
					</div>
				</div>
			</div>

			<h2 className='text-2xl font-bold mb-4'>
				Jobs at {company.name}
			</h2>

			{!company.jobs || company.jobs.length === 0 ? (
				<div className='bg-gray-50 rounded-lg p-6 text-center'>
					<p className='text-gray-600'>
						No active job listings for this
						company
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{company.jobs.map((job) => (
						<Link
							key={job._id}
							href={`/jobs/${job.slug.current}`}>
							<div className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
								<h3 className='text-xl font-semibold mb-2'>
									{
										job.title
									}
								</h3>
								<div className='flex flex-wrap gap-2 mb-3'>
									<span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>
										{
											job
												.jobType
												.name
										}
									</span>
									<span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded'>
										{
											job
												.location
												.name
										}
									</span>
									<span className='bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded'>
										{
											job
												.level
												.name
										}
									</span>
								</div>
								<div className='text-sm text-gray-500'>
									<p>
										Posted:{" "}
										{new Date(
											job.publishedAt,
										).toLocaleDateString()}
									</p>
									{job.deadline && (
										<p>
											Deadline:{" "}
											{new Date(
												job.deadline,
											).toLocaleDateString()}
										</p>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
