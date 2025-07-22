import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { searchJobsQuery, getFiltersQuery } from "@/sanity/lib/queries";
import SearchPageClient from "./SearchPageClient";

// Generate metadata for SEO
export async function generateMetadata({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const { q, location } = searchParams;

	let title = "Job Search";
	let description = "Find your dream job";

	if (q && location) {
		title = `${q} Jobs in ${location}`;
		description = `Find ${q} jobs in ${location}. Browse the latest job opportunities.`;
	} else if (q) {
		title = `${q} Jobs`;
		description = `Find ${q} jobs. Browse the latest job opportunities.`;
	} else if (location) {
		title = `Jobs in ${location}`;
		description = `Find jobs in ${location}. Browse the latest job opportunities.`;
	}

	return {
		title,
		description,
	};
}

// Server component for SEO
export default async function SearchPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const {
		q = "",
		location = "",
		jobType = "",
		jobLevel = "",
		education = "",
		jobField = "",
	} = searchParams;

	// Server-side data fetching for SEO
	const [initialJobs, initialFilters] = await Promise.all([
		// Only fetch jobs if there are search criteria
		Object.values(searchParams).some(
			(value) =>
				typeof value === "string" &&
				value.trim() !== "",
		)
			? client.fetch(searchJobsQuery, {
					q: q || "",
					location,
					jobType,
					jobLevel,
					education,
					jobField,
				})
			: [],
		client.fetch(getFiltersQuery),
	]);

	return (
		<Suspense fallback={<SearchPageSkeleton />}>
			<SearchPageClient
				initialJobs={initialJobs}
				initialFilters={initialFilters}
				searchParams={searchParams}
			/>
		</Suspense>
	);
}

function SearchPageSkeleton() {
	return (
		<main className='mx-auto'>
			<div className='px-2 bg-white rounded-md'>
				<div className='h-20 bg-gray-200 animate-pulse rounded' />
				<div className='h-10 bg-gray-200 animate-pulse rounded mt-4' />
			</div>
			<div className='flex flex-col gap-6 my-2 md:flex-row'>
				<div className='md:w-1/4 min-h-[60vh] bg-gray-100 animate-pulse rounded' />
				<div className='flex-1 bg-gray-100 animate-pulse rounded min-h-[60vh]' />
			</div>
		</main>
	);
}
