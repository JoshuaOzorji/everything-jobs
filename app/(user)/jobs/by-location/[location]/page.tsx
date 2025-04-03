import { Metadata } from "next";
import { getLocations, getJobsByLocation } from "@/sanity/lib/queries";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import AsideComponent from "@/components/AsideComponent";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types";
import JobCardCategories from "@/components/JobCardCategories";

type Params = {
	params: Promise<{ location: string }>;
};

type LocationType = {
	slug: string;
	name: string;
	jobCount?: number;
};

export async function generateStaticParams() {
	const locations: LocationType[] = await getLocations();
	return locations
		.filter((location) => location.slug)
		.map((location) => ({
			location: location.slug,
		}));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { location } = await params;
	const locations = await getLocations();
	const locationData = locations.find(
		(loc: LocationType) => loc.slug === location,
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

export default async function LocationJobsPage({ params }: Params) {
	const { location } = await params;

	// Validate location parameter
	if (!location || location === "null") {
		return notFound();
	}

	const locations: LocationType[] = await getLocations();
	const locationData = locations.find(
		(loc: LocationType) => loc.slug === location,
	);

	if (!locationData) {
		return notFound();
	}

	const jobs = await getJobsByLocation(location);

	return (
		<SubLayout aside={<AsideComponent />}>
			<div className='page-container'>
				<h1 className='page-h1'>
					Jobs in {locationData.name}, Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {jobs.length} job
						opportunities in{" "}
						{locationData.name}. Find your
						next career opportunity locally.
					</p>
				</div>

				{jobs.length > 0 ? (
					<div className='flex flex-col gap-2'>
						{jobs.map((job: Job) => (
							<JobCardCategories
								key={job._id}
								job={{
									...job,
									slug: job
										.slug
										.current,
								}}
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
