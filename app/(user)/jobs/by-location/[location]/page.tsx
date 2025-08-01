import { Metadata } from "next";
import { getLocations, getJobsByLocation } from "@/sanity/lib/queries";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import AsideMain from "@/components/sidebar/AsideMain";
import SubLayout from "@/components/SubLayout";
import { Job } from "@/types/types";
import JobCardCategories from "@/components/JobCardCategories";
import Link from "next/link";

type Params = {
	params: Promise<{ location: string }>;
};

type SearchParams = {
	page?: string;
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

export default async function LocationJobsPage({
	params,
	searchParams,
}: {
	params: Promise<{ location: string }>;
	searchParams: Promise<SearchParams>;
}) {
	const { location } = await params;
	const resolvedSearchParams = await searchParams;

	// Validate location parameter
	if (!location || location === "null") {
		return notFound();
	}

	// Convert page to number, default to 1
	const currentPage = resolvedSearchParams?.page
		? parseInt(resolvedSearchParams.page, 10)
		: 1;
	const perPage = 10;

	const locations: LocationType[] = await getLocations();
	const locationData = locations.find(
		(loc: LocationType) => loc.slug === location,
	);

	if (!locationData) {
		return notFound();
	}

	const { jobs, totalCount } = await getJobsByLocation(
		location,
		currentPage,
		perPage,
	);

	return (
		<SubLayout
			aside={
				<div className='hidden md:block'>
					<AsideMain />
				</div>
			}>
			<div className='page-container'>
				<h1 className='page-h1'>
					Jobs in {locationData.name}, Nigeria
				</h1>

				{/* <div className='page-sub-div'>
					<p className='page-p'>
						Browse {totalCount} job
						opportunities in{" "}
						{locationData.name}. Find your
						next career opportunity locally.
					</p>
				</div> */}

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
					<div className='py-12 text-center font-saira'>
						<h2 className='text-base font-semibold md:text-lg'>
							No jobs currently
							available in{" "}
							{locationData.name}
						</h2>
						<Link
							href='/jobs/by-location'
							className=''>
							<button className='px-4 py-2 mt-2 text-sm font-medium underline transition-colors text-pry2 md:text-base hover:text-pry'>
								Browse all
								locations
							</button>
						</Link>
					</div>
				)}

				{totalCount > perPage && (
					<Pagination
						currentPage={currentPage}
						total={totalCount}
						perPage={perPage}
					/>
				)}
			</div>
		</SubLayout>
	);
}
