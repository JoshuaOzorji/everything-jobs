// app/search/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Job {
	_id: string;
	title: string;
	slug: string;
	company: string;
	companyLogo?: string;
	location: string[];
	jobType: string;
	level: string;
	qualification: string;
	jobField: string;
	salaryRange: { min: number; max: number };
	publishedAt: string;
	deadline: string;
}

interface Filter {
	_id: string;
	name: string;
}

interface FilterOptions {
	jobTypes: Filter[];
	jobLevels: Filter[];
	qualifications: Filter[];
	jobFields: Filter[];
}

export default function SearchPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<FilterOptions | null>(null);
	const [showFilters, setShowFilters] = useState(false);

	// Get current filter values from URL
	const query = searchParams.get("query") || "";
	const location = searchParams.get("location") || "";
	const jobType = searchParams.get("jobType") || "";
	const jobLevel = searchParams.get("jobLevel") || "";
	const qualification = searchParams.get("qualification") || "";
	const jobField = searchParams.get("jobField") || "";

	// Fetch jobs based on search params
	useEffect(() => {
		const fetchJobs = async () => {
			setLoading(true);
			try {
				// Create query string for the API
				const params = new URLSearchParams();
				if (query) params.append("query", query);
				if (location)
					params.append("location", location);
				if (jobType) params.append("jobType", jobType);
				if (jobLevel)
					params.append("jobLevel", jobLevel);
				if (qualification)
					params.append(
						"qualification",
						qualification,
					);
				if (jobField)
					params.append("jobField", jobField);

				const response = await fetch(
					`/api/search?${params.toString()}`,
				);
				const data = await response.json();

				if (data.jobs) {
					setJobs(data.jobs);
				}

				if (data.filters) {
					setFilters(data.filters);
				}
			} catch (error) {
				console.error("Error fetching jobs:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchJobs();
	}, [query, location, jobType, jobLevel, qualification, jobField]);

	// Update URL with filter selection
	const updateFilters = (filterName: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (value) {
			params.set(filterName, value);
		} else {
			params.delete(filterName);
		}

		router.push(`/search?${params.toString()}`);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className='container px-4 py-8 mx-auto'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>
					{query
						? `Search Results for "${query}"`
						: "All Jobs"}
					{location && ` in ${location}`}
				</h1>
				<p className='mt-2 text-gray-600'>
					{jobs.length} jobs found
				</p>
			</div>

			{/* Mobile filter toggle */}
			<button
				className='w-full p-3 mb-4 text-center text-white rounded bg-pry md:hidden'
				onClick={() => setShowFilters(!showFilters)}>
				{showFilters ? "Hide Filters" : "Show Filters"}
			</button>

			<div className='flex flex-col gap-6 md:flex-row'>
				{/* Filters sidebar */}
				<div
					className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 bg-white p-4 rounded shadow`}>
					<h2 className='mb-4 text-lg font-semibold'>
						Filter Results
					</h2>

					{filters && (
						<>
							{/* Job Type Filter */}
							<div className='mb-4'>
								<label className='block mb-2 text-sm font-medium'>
									Job Type
								</label>
								<select
									value={
										jobType
									}
									onChange={(
										e,
									) =>
										updateFilters(
											"jobType",
											e
												.target
												.value,
										)
									}
									className='w-full p-2 border rounded'>
									<option value=''>
										All
										Job
										Types
									</option>
									{filters.jobTypes.map(
										(
											type,
										) => (
											<option
												key={
													type._id
												}
												value={
													type.name
												}>
												{
													type.name
												}
											</option>
										),
									)}
								</select>
							</div>

							{/* Job Level Filter */}
							<div className='mb-4'>
								<label className='block mb-2 text-sm font-medium'>
									Experience
									Level
								</label>
								<select
									value={
										jobLevel
									}
									onChange={(
										e,
									) =>
										updateFilters(
											"jobLevel",
											e
												.target
												.value,
										)
									}
									className='w-full p-2 border rounded'>
									<option value=''>
										All
										Levels
									</option>
									{filters.jobLevels.map(
										(
											level,
										) => (
											<option
												key={
													level._id
												}
												value={
													level.name
												}>
												{
													level.name
												}
											</option>
										),
									)}
								</select>
							</div>

							{/* Qualification Filter */}
							<div className='mb-4'>
								<label className='block mb-2 text-sm font-medium'>
									Qualification
								</label>
								<select
									value={
										qualification
									}
									onChange={(
										e,
									) =>
										updateFilters(
											"qualification",
											e
												.target
												.value,
										)
									}
									className='w-full p-2 border rounded'>
									<option value=''>
										All
										Qualifications
									</option>
									{filters.qualifications.map(
										(
											qual,
										) => (
											<option
												key={
													qual._id
												}
												value={
													qual.name
												}>
												{
													qual.name
												}
											</option>
										),
									)}
								</select>
							</div>

							{/* Job Field Filter */}
							<div className='mb-4'>
								<label className='block mb-2 text-sm font-medium'>
									Job
									Field
								</label>
								<select
									value={
										jobField
									}
									onChange={(
										e,
									) =>
										updateFilters(
											"jobField",
											e
												.target
												.value,
										)
									}
									className='w-full p-2 border rounded'>
									<option value=''>
										All
										Fields
									</option>
									{filters.jobFields.map(
										(
											field,
										) => (
											<option
												key={
													field._id
												}
												value={
													field.name
												}>
												{
													field.name
												}
											</option>
										),
									)}
								</select>
							</div>

							{/* Clear filters button */}
							<button
								onClick={() =>
									router.push(
										`/search${query ? `?query=${query}` : ""}${location ? `&location=${location}` : ""}`,
									)
								}
								className='w-full px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300'>
								Clear Filters
							</button>
						</>
					)}
				</div>

				{/* Results */}
				<div className='md:w-3/4'>
					{loading ? (
						<div className='flex items-center justify-center min-h-[300px]'>
							<div className='w-12 h-12 border-t-2 border-b-2 rounded-full border-pry animate-spin'></div>
						</div>
					) : jobs.length > 0 ? (
						<div className='grid gap-4'>
							{jobs.map((job) => (
								<Link
									href={`/jobs/${job.slug}`}
									key={
										job._id
									}
									className='block'>
									<div className='p-4 transition bg-white rounded shadow hover:shadow-md'>
										<div className='flex items-start justify-between'>
											<div className='flex gap-3'>
												{job.companyLogo && (
													<div className='w-12 h-12 overflow-hidden rounded'>
														<Image
															src={
																job.companyLogo
															}
															alt={
																job.company
															}
															width={
																48
															}
															height={
																48
															}
															className='object-cover w-full h-full'
														/>
													</div>
												)}
												<div>
													<h2 className='text-lg font-semibold'>
														{
															job.title
														}
													</h2>
													<p className='text-gray-600'>
														{
															job.company
														}
													</p>
													<div className='flex flex-wrap gap-2 mt-2'>
														{job.location &&
															job
																.location
																.length >
																0 && (
																<span className='px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded'>
																	{
																		job
																			.location[0]
																	}
																</span>
															)}
														<span className='px-2 py-1 text-xs text-green-800 bg-green-100 rounded'>
															{
																job.jobType
															}
														</span>
														<span className='px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded'>
															{
																job.level
															}
														</span>
													</div>
													{job.salaryRange && (
														<p className='mt-2 text-sm'>
															Salary:
															$
															{job.salaryRange.min.toLocaleString()}{" "}
															-
															$
															{job.salaryRange.max.toLocaleString()}
														</p>
													)}
												</div>
											</div>
											<div className='text-sm text-gray-500'>
												{formatDate(
													job.publishedAt,
												)}
											</div>
										</div>
										<div className='flex justify-between mt-3 text-sm'>
											<div>
												<span className='text-pry'>
													{
														job.jobField
													}
												</span>{" "}
												•{" "}
												<span>
													{
														job.qualification
													}
												</span>
											</div>
											{job.deadline && (
												<div className='text-red-500'>
													Deadline:{" "}
													{formatDate(
														job.deadline,
													)}
												</div>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className='p-8 text-center bg-white rounded shadow'>
							<h3 className='mb-2 text-xl font-semibold'>
								No jobs found
							</h3>
							<p className='text-gray-600'>
								Try adjusting
								your search
								criteria or
								browse all
								available jobs.
							</p>
							<button
								onClick={() =>
									router.push(
										"/",
									)
								}
								className='px-4 py-2 mt-4 text-white rounded bg-pry hover:bg-sec'>
								View All Jobs
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
