import { Metadata } from "next";
import { getJobTypes } from "@/sanity/lib/queries";
import CategoryList from "@/components/CategoryList";

export const metadata: Metadata = {
	title: "Jobs by Type | Find Full-time, Part-time, Remote Jobs in Nigeria",
	description:
		"Browse job opportunities by employment type in Nigeria. Find full-time, part-time, contract, remote, and other job types.",
	keywords: "Nigeria job types, full-time jobs, part-time jobs, contract jobs, remote jobs, internships",
	openGraph: {
		title: "Jobs by Type | Find Full-time, Part-time, Remote Jobs in Nigeria",
		description:
			"Browse job opportunities by employment type in Nigeria.",
		type: "website",
	},
};

// Generate static page at build time for better performance
export const revalidate = 3600; // Revalidate every hour

export default async function JobsByTypePage() {
	const jobTypes = await getJobTypes();

	return (
		<div className='py-4 mx-auto md:py-8'>
			<h1 className='mb-6 text-2xl font-bold md:text-3xl font-poppins'>
				Jobs by Type
			</h1>

			<div className='page-sub-div'>
				<p className='page-p'>
					Find job opportunities by employment
					type across Nigeria. Browse full-time,
					part-time, contract, remote jobs and
					more.
				</p>
			</div>

			<CategoryList
				items={jobTypes}
				basePath='/jobs/by-type'
				nameKey='name'
				slugKey='slug.current'
				countKey='jobCount'
			/>
		</div>
	);
}
