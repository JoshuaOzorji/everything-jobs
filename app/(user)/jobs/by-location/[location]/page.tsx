// import { Metadata } from "next";
// import { getLocations, getJobsByLocation } from "@/sanity/lib/queries";
// import JobCard from "@/components/JobCard";
// import Pagination from "@/components/Pagination";

// // Generate static paths for all locations
// export async function generateStaticParams() {
// 	const locations = await getLocations();
// 	return locations.map((location) => ({
// 		location: location.slug.current,
// 	}));
// }

// // Dynamic metadata for each location page
// export async function generateMetadata({
// 	params,
// }: {
// 	params: { location: string };
// }): Promise<Metadata> {
// 	const locations = await getLocations();
// 	const locationData = locations.find(
// 		(loc) => loc.slug.current === params.location,
// 	);

// 	if (!locationData) return { title: "Location not found" };

// 	return {
// 		title: `Jobs in ${locationData.name}, Nigeria | Latest Openings`,
// 		description: `Find the latest job vacancies and career opportunities in ${locationData.name}, Nigeria. Browse ${locationData.jobCount}+ job listings in ${locationData.name}.`,
// 		keywords: `jobs in ${locationData.name}, ${locationData.name} jobs, employment in ${locationData.name}, vacancies in ${locationData.name}`,
// 		openGraph: {
// 			title: `Jobs in ${locationData.name}, Nigeria | Latest Openings`,
// 			description: `Find the latest job vacancies in ${locationData.name}, Nigeria.`,
// 			type: "website",
// 		},
// 	};
// }

// export default async function LocationJobsPage({
// 	params,
// }: {
// 	params: { location: string };
// }) {
// 	const { location } = params;

// 	const locations = await getLocations();
// 	const locationData = locations.find(
// 		(loc) => loc.slug.current === location,
// 	);

// 	if (!locationData) {
// 		<>No data found</>;
// 	}

// 	const jobs = await getJobsByLocation(location);

// 	return (
// 		<div className='px-4 py-8 mx-auto'>
// 			<h1 className='mb-6 text-3xl font-bold'>
// 				Jobs in {locationData.name}, Nigeria
// 			</h1>

// 			<div className='mb-8'>
// 				<p className='text-lg'>
// 					Browse {jobs.length} job opportunities
// 					in {locationData.name}. Find your next
// 					career opportunity locally.
// 				</p>
// 			</div>

// 			{jobs.length > 0 ? (
// 				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
// 					{jobs.map((job) => (
// 						<JobCard
// 							key={job._id}
// 							job={job}
// 						/>
// 					))}
// 				</div>
// 			) : (
// 				<div className='py-12 text-center'>
// 					<h2 className='text-xl font-semibold'>
// 						No jobs currently available in{" "}
// 						{locationData.name}
// 					</h2>
// 					<p className='mt-2'>
// 						Check back later or browse jobs
// 						in other locations.
// 					</p>
// 				</div>
// 			)}

// 			{jobs.length > 10 && <Pagination total={jobs.length} />}
// 		</div>
// 	);
// }

import { Metadata } from "next";
import { getLocations, getJobsByLocation } from "@/sanity/lib/queries";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import AsideComponent from "@/components/AsideComponent";
import SubLayout from "@/components/SubLayout";

export async function generateStaticParams() {
	const locations = await getLocations();
	return locations
		.filter((location) => location.slug) // Filter out locations with null slugs
		.map((location) => ({
			location: location.slug,
		}));
}

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}): Promise<Metadata> {
	const locations = await getLocations();
	const locationData = locations.find(
		(loc) => loc.slug === params.location,
	);

	if (!locationData) return { title: "Location not found" };

	return {
		title: `Jobs in ${locationData.name}, Nigeria | Latest Openings`,
		description: `Find the latest job vacancies and career opportunities in ${locationData.name}, Nigeria. Browse ${locationData.jobCount || 0} job listings in ${locationData.name}.`,
		keywords: `jobs in ${locationData.name}, ${locationData.name} jobs, employment in ${locationData.name}, vacancies in ${locationData.name}`,
		openGraph: {
			title: `Jobs in ${locationData.name}, Nigeria | Latest Openings`,
			description: `Find the latest job vacancies in ${locationData.name}, Nigeria.`,
			type: "website",
		},
	};
}

export default async function LocationJobsPage({
	params,
}: {
	params: { location: string };
}) {
	const { location } = params;

	// Validate location parameter
	if (!location || location === "null") {
		return notFound();
	}

	const locations = await getLocations();
	const locationData = locations.find((loc) => loc.slug === location);

	if (!locationData) {
		return notFound();
	}

	const jobs = await getJobsByLocation(location);

	return (
		<SubLayout aside={<AsideComponent />}>
			<div className='px-4 py-8 mx-auto'>
				<h1 className='mb-6 text-3xl font-bold'>
					Jobs in {locationData.name}, Nigeria
				</h1>

				<div className='mb-8'>
					<p className='text-lg'>
						Browse {jobs.length} job
						opportunities in{" "}
						{locationData.name}. Find your
						next career opportunity locally.
					</p>
				</div>

				{jobs.length > 0 ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{jobs.map((job) => (
							<JobCard
								key={job._id}
								job={job}
							/>
						))}
					</div>
				) : (
					<div className='py-12 text-center'>
						<h2 className='text-xl font-semibold'>
							No jobs currently
							available in{" "}
							{locationData.name}
						</h2>
						<p className='mt-2'>
							Check back later or
							browse jobs in other
							locations.
						</p>
					</div>
				)}

				{jobs.length > 10 && (
					<Pagination total={jobs.length} />
				)}
			</div>
		</SubLayout>
	);
}
