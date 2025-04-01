import { Metadata } from "next";
import { getJobFields } from "@/sanity/lib/queries";
import CategoryList from "@/components/CategoryList";

export const metadata: Metadata = {
	title: "Jobs by Field | Find Jobs in Nigeria by Career Areas",
	description:
		"Browse job opportunities across various professional fields in Nigeria. Find careers in tech, finance, healthcare, engineering, and more.",
	keywords: "Nigeria jobs by field, career opportunities, job sectors, professional jobs",
	openGraph: {
		title: "Jobs by Field | Find Jobs in Nigeria by Career Areas",
		description:
			"Browse job opportunities across various professional fields in Nigeria.",
		type: "website",
	},
};

export default async function JobsByFieldPage() {
	const jobFields = await getJobFields();

	return (
		<div className='py-4 mx-auto md:py-8'>
			<h1 className='mb-6 text-2xl font-bold md:text-3xl font-poppins'>
				Jobs by Field
			</h1>

			<div className='page-sub-div'>
				<p className='page-p'>
					Explore job opportunities across
					different professional fields in
					Nigeria. Find your ideal career path in
					various sectors and industries.
				</p>
			</div>

			<CategoryList
				items={jobFields}
				basePath='/jobs/by-field'
				nameKey='displayName'
				slugKey='slug.current'
				countKey='jobCount'
			/>
		</div>
	);
}
