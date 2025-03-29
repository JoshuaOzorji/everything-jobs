import { Metadata } from "next";
import { getEducationLevels } from "@/sanity/lib/queries";
import CategoryList from "@/components/CategoryList";

export const metadata: Metadata = {
	title: "Jobs by Education Level | Find Jobs in Nigeria by Qualification",
	description:
		"Browse job opportunities by education level. Find jobs for various qualifications from entry-level to executive positions.",
	keywords: "Nigeria jobs by education, jobs by qualification, entry-level jobs, professional jobs",
	openGraph: {
		title: "Jobs by Education Level | Find Jobs in Nigeria by Qualification",
		description:
			"Browse job opportunities across different education levels in Nigeria.",
		type: "website",
	},
};

export default async function JobsByEducationPage() {
	const educationLevels = await getEducationLevels();

	return (
		<div className='py-4 mx-auto md:py-8'>
			<h1 className='mb-6 text-2xl font-bold md:text-3xl font-poppins'>
				Jobs by Education Level
			</h1>

			<div className='page-sub-div'>
				<p className='page-p'>
					Discover job opportunities tailored to
					your educational background. Find roles
					that match your qualifications and
					career aspirations.
				</p>
			</div>

			<CategoryList
				items={educationLevels}
				basePath='/jobs/by-education'
				nameKey='name'
				slugKey='slug.current'
				countKey='jobCount'
			/>
		</div>
	);
}
