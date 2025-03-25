import { Metadata } from "next";
import Link from "next/link";
import { getLocations } from "@/lib/sanity/client";
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
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>
				Jobs by Location
			</h1>

			<div className='mb-6'>
				<p className='text-lg'>
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
