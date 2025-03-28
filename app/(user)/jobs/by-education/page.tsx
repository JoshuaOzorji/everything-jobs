import { Metadata } from "next";
import { getQualifications } from "@/sanity/lib/queries";
import CategoryList from "@/components/CategoryList";

export const metadata: Metadata = {
	title: "Jobs by Qualification | Find Jobs by Education Level in Nigeria",
	description:
		"Browse job opportunities across different education levels in Nigeria. From SSCE to PhD, find jobs matching your qualifications.",
	keywords: "Nigeria jobs by qualification, jobs by education level, entry-level jobs, professional jobs",
	openGraph: {
		title: "Jobs by Qualification | Find Jobs by Education Level in Nigeria",
		description:
			"Browse job opportunities across different education levels in Nigeria.",
		type: "website",
	},
};

export default async function JobsByQualificationPage() {
	const qualifications = await getQualifications();

	return (
		<div className='py-4 mx-auto md:py-8'>
			<h1 className='mb-6 text-2xl font-bold md:text-3xl font-poppins'>
				Jobs by Qualification
			</h1>

			<div className='page-sub-div'>
				<p className='page-p'>
					Explore job opportunities tailored to
					your educational background. Find
					positions that match your qualification
					level from entry-level to advanced
					professional roles.
				</p>
			</div>

			<CategoryList
				items={qualifications}
				basePath='/jobs/by-education'
				nameKey='name'
				slugKey='slug.current'
				countKey='jobCount'
			/>
		</div>
	);
}
