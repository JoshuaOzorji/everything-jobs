"use client";

import { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JobDraft } from "@/lib/hooks/useJobDraft";
import { client } from "@/sanity/lib/client";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface JobDetailsProps {
	register: UseFormRegister<JobDraft>;
	errors: FieldErrors<JobDraft>;
}

interface ReferenceData {
	_id: string;
	name: string;
}

export default function JobDetails({ register, errors }: JobDetailsProps) {
	const [locations, setLocations] = useState<ReferenceData[]>([]);
	const [jobTypes, setJobTypes] = useState<ReferenceData[]>([]);
	const [levels, setLevels] = useState<ReferenceData[]>([]);

	useEffect(() => {
		async function fetchReferenceData() {
			try {
				const [
					locationsData,
					jobTypesData,
					levelsData,
				] = await Promise.all([
					client.fetch(
						'*[_type == "state"] | order(name asc)',
					),
					client.fetch(
						'*[_type == "jobType"] | order(name asc)',
					),
					client.fetch(
						'*[_type == "jobLevel"] | order(name asc)',
					),
				]);

				setLocations(locationsData);
				setJobTypes(jobTypesData);
				setLevels(levelsData);
			} catch (error) {
				console.error(
					"Error fetching reference data:",
					error,
				);
			}
		}

		fetchReferenceData();
	}, []);

	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium'>Job Details</h3>

			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
				<FormItem>
					<FormLabel>Location</FormLabel>
					<Select
						onValueChange={(value) =>
							register(
								"location._ref",
							).onChange(value)
						}>
						<SelectTrigger>
							<SelectValue placeholder='Select location' />
						</SelectTrigger>
						<SelectContent>
							{locations.map(
								(location) => (
									<SelectItem
										key={
											location._id
										}
										value={
											location._id
										}>
										{
											location.name
										}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
					{errors.location && (
						<FormMessage>
							{
								errors.location
									._ref
									?.message
							}
						</FormMessage>
					)}
				</FormItem>

				<FormItem>
					<FormLabel>Job Type</FormLabel>
					<Select
						onValueChange={(value) =>
							register(
								"jobType._ref",
							).onChange(value)
						}>
						<SelectTrigger>
							<SelectValue placeholder='Select job type' />
						</SelectTrigger>
						<SelectContent>
							{jobTypes.map(
								(type) => (
									<SelectItem
										key={
											type._id
										}
										value={
											type._id
										}>
										{
											type.name
										}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
					{errors.jobType && (
						<FormMessage>
							{
								errors.jobType
									._ref
									?.message
							}
						</FormMessage>
					)}
				</FormItem>
			</div>

			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
				<FormItem>
					<FormLabel>Minimum Salary</FormLabel>
					<FormControl>
						<Input
							type='number'
							{...register(
								"salaryRange.min",
								{
									valueAsNumber:
										true,
								},
							)}
							placeholder='e.g., 50000'
						/>
					</FormControl>
					{errors.salaryRange?.min && (
						<FormMessage>
							{
								errors
									.salaryRange
									.min
									.message
							}
						</FormMessage>
					)}
				</FormItem>

				<FormItem>
					<FormLabel>Maximum Salary</FormLabel>
					<FormControl>
						<Input
							type='number'
							{...register(
								"salaryRange.max",
								{
									valueAsNumber:
										true,
								},
							)}
							placeholder='e.g., 80000'
						/>
					</FormControl>
					{errors.salaryRange?.max && (
						<FormMessage>
							{
								errors
									.salaryRange
									.max
									.message
							}
						</FormMessage>
					)}
				</FormItem>
			</div>
		</div>
	);
}
