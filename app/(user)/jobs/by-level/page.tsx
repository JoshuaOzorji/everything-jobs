// app/jobs/by-level/page.tsx

import { Metadata } from "next";
import { getJobLevels } from "@/sanity/lib/queries";
import CategoryList from "@/components/CategoryList";

export const metadata: Metadata = {
	title: "Jobs by Level | Find Entry, Mid, Senior Level Jobs in Nigeria",
	description:
		"Browse job opportunities by experience level in Nigeria. Find entry-level, mid-level, senior-level, director, and executive positions.",
	keywords: "Nigeria job levels, entry-level jobs, mid-level jobs, senior-level jobs, executive jobs",
	openGraph: {
		title: "Jobs by Level | Find Entry, Mid, Senior Level Jobs in Nigeria",
		description:
			"Browse job opportunities by experience level in Nigeria.",
		type: "website",
	},
};

// Generate static page at build time for better performance
export const revalidate = 3600; // Revalidate every hour

export default async function JobsByLevelPage() {
	const jobLevels = await getJobLevels();

	return (
		<div className='py-4 mx-auto md:py-8'>
			<h1 className='mb-6 text-2xl font-bold md:text-3xl font-poppins'>
				Jobs by Level
			</h1>

			<div className='page-sub-div'>
				<p className='page-p'>
					Find job opportunities by experience
					level across Nigeria. Browse
					entry-level, mid-level, senior-level
					positions and more.
				</p>
			</div>

			<CategoryList
				items={jobLevels}
				basePath='/jobs/by-level'
				nameKey='name'
				slugKey='slug'
				countKey='jobCount'
			/>
		</div>
	);
}
