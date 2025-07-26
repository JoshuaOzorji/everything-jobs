import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { client } from "@/sanity/lib/client";

interface ReferenceData {
	_id: string;
	name: string;
}

interface ReferenceDataResponse {
	locations: ReferenceData[];
	jobTypes: ReferenceData[];
	levels: ReferenceData[];
	educations: ReferenceData[];
	jobFields: ReferenceData[];
}

// Individual query functions
const fetchLocations = () =>
	client.fetch('*[_type == "state"] | order(name asc)');

const fetchJobTypes = () =>
	client.fetch('*[_type == "jobType"] | order(name asc)');

const fetchLevels = () =>
	client.fetch('*[_type == "jobLevel"] | order(name asc)');

const fetchEducations = () =>
	client.fetch('*[_type == "education"] | order(name asc)');

const fetchJobFields = () =>
	client.fetch('*[_type == "jobField"] | order(name asc)');

// Combined fetch function for all reference data
const fetchAllReferenceData = async (): Promise<ReferenceDataResponse> => {
	try {
		const [locations, jobTypes, levels, educations, jobFields] =
			await Promise.all([
				fetchLocations(),
				fetchJobTypes(),
				fetchLevels(),
				fetchEducations(),
				fetchJobFields(),
			]);

		return {
			locations,
			jobTypes,
			levels,
			educations,
			jobFields,
		};
	} catch (error) {
		console.error("Error fetching reference data:", error);
		throw error;
	}
};

// Main hook for all reference data
export const useReferenceData = () => {
	const query = useQuery<ReferenceDataResponse, Error>({
		queryKey: ["reference-data", "all"],
		queryFn: fetchAllReferenceData,
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
		refetchOnWindowFocus: false,
		retry: 2,
	});

	// Handle errors with useEffect since onError is removed in v5
	useEffect(() => {
		if (query.error) {
			console.error(
				"Failed to fetch reference data:",
				query.error,
			);
			toast.error("Failed to load form data", {
				description:
					"Please refresh the page to try again",
			});
		}
	}, [query.error]);

	return query;
};

// Individual hooks if you need them elsewhere
export const useLocations = () => {
	const query = useQuery<ReferenceData[], Error>({
		queryKey: ["reference-data", "locations"],
		queryFn: fetchLocations,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 2,
	});

	useEffect(() => {
		if (query.error) {
			console.error(
				"Failed to fetch locations:",
				query.error,
			);
			toast.error("Failed to load locations");
		}
	}, [query.error]);

	return query;
};

export const useJobTypes = () => {
	const query = useQuery<ReferenceData[], Error>({
		queryKey: ["reference-data", "job-types"],
		queryFn: fetchJobTypes,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 2,
	});

	useEffect(() => {
		if (query.error) {
			console.error(
				"Failed to fetch job types:",
				query.error,
			);
			toast.error("Failed to load job types");
		}
	}, [query.error]);

	return query;
};

export const useLevels = () => {
	const query = useQuery<ReferenceData[], Error>({
		queryKey: ["reference-data", "levels"],
		queryFn: fetchLevels,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 2,
	});

	useEffect(() => {
		if (query.error) {
			console.error("Failed to fetch levels:", query.error);
			toast.error("Failed to load experience levels");
		}
	}, [query.error]);

	return query;
};

export const useEducations = () => {
	const query = useQuery<ReferenceData[], Error>({
		queryKey: ["reference-data", "educations"],
		queryFn: fetchEducations,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 2,
	});

	useEffect(() => {
		if (query.error) {
			console.error(
				"Failed to fetch educations:",
				query.error,
			);
			toast.error("Failed to load education levels");
		}
	}, [query.error]);

	return query;
};

export const useJobFields = () => {
	const query = useQuery<ReferenceData[], Error>({
		queryKey: ["reference-data", "job-fields"],
		queryFn: fetchJobFields,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 2,
	});

	useEffect(() => {
		if (query.error) {
			console.error(
				"Failed to fetch job fields:",
				query.error,
			);
			toast.error("Failed to load job fields");
		}
	}, [query.error]);

	return query;
};
