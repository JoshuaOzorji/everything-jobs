import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { searchJobsQuery, getFiltersQuery } from "@/sanity/lib/queries";
import SearchPageClient from "./SearchPageClient";
import { LoadingComponent } from "@/components/Loading";

interface PageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const { q, location } = resolvedSearchParams;

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
	} else {
		title = "Latest Jobs";
		description =
			"Browse the latest job opportunities. Find your dream job today.";
	}

	return {
		title,
		description,
	};
}

// Server component for SEO
export default async function SearchPage({ searchParams }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const {
		q = "",
		location = "",
		jobType = "",
		jobLevel = "",
		education = "",
		jobField = "",
		page = "1",
	} = resolvedSearchParams;

	// Server-side data fetching for SEO
	// Always fetch jobs - when no search params, it will return all jobs ordered by latest
	const currentPage = parseInt(typeof page === "string" ? page : "1", 10);
	const perPage = 10; // Jobs per page

	const [initialJobs, initialFilters] = await Promise.all([
		client.fetch(searchJobsQuery, {
			q: q || "",
			location,
			jobType,
			jobLevel,
			education,
			jobField,
			offset: (currentPage - 1) * perPage,
			limit: perPage,
		}),
		client.fetch(getFiltersQuery),
	]);

	return (
		<Suspense fallback={<LoadingComponent />}>
			<SearchPageClient
				initialJobs={initialJobs}
				initialFilters={initialFilters}
				currentPage={currentPage}
				perPage={perPage}
				searchParams={{
					q: typeof q === "string" ? q : "",
					location:
						typeof location === "string"
							? location
							: "",
					jobType:
						typeof jobType === "string"
							? jobType
							: "",
					jobLevel:
						typeof jobLevel === "string"
							? jobLevel
							: "",
					education:
						typeof education === "string"
							? education
							: "",
					jobField:
						typeof jobField === "string"
							? jobField
							: "",
					page:
						typeof page === "string"
							? page
							: "1",
				}}
			/>
		</Suspense>
	);
}
