import { Metadata } from "next";
import { getLocations } from "@/sanity/lib/queries";
import CategoryList from "@/components/CategoryList";

export const metadata: Metadata = {
	title: "Jobs by Location | Find Jobs in Nigeria by State",
	description:
		"Browse job opportunities across all states in Nigeria. Find local jobs in Lagos, Abuja, Port Harcourt and more regions.",
	keywords: "Nigeria jobs by location, jobs in Lagos, jobs in Abuja, state jobs Nigeria",
	openGraph: {
		title: "Jobs by Location | Find Jobs in Nigeria by State",
		description:
			"Browse job opportunities across all states in Nigeria.",
		type: "website",
	},
};

export default async function JobsByLocationPage() {
	const locations = await getLocations();

	return (
		<div className='py-4 mx-auto md:py-8'>
			<h1 className='mb-6 text-2xl font-bold md:text-3xl font-poppins'>
				Jobs by Location
			</h1>

			<div className='page-sub-div'>
				<p className='page-p'>
					Find job opportunities in your state or
					city across Nigeria. Browse jobs
					available in all 36 states and the
					Federal Capital Territory.
				</p>
			</div>

			<CategoryList
				items={locations}
				basePath='/jobs/by-location'
				nameKey='name'
				slugKey='slug.current'
				countKey='jobCount'
			/>
		</div>
	);
}
