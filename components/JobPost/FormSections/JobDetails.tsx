"use client";

import { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
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
	control: Control<JobDraft>; // Add control prop
}

interface ReferenceData {
	_id: string;
	name: string;
}

export default function JobDetails({
	register,
	errors,
	control,
}: JobDetailsProps) {
	const [locations, setLocations] = useState<ReferenceData[]>([]);
	const [jobTypes, setJobTypes] = useState<ReferenceData[]>([]);
	const [levels, setLevels] = useState<ReferenceData[]>([]);
	const [educations, setEducations] = useState<ReferenceData[]>([]);
	const [jobFields, setJobFields] = useState<ReferenceData[]>([]);

	useEffect(() => {
		async function fetchReferenceData() {
			try {
				const [
					locationsData,
					jobTypesData,
					levelsData,
					educationsData,
					jobFieldsData,
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
					client.fetch(
						'*[_type == "education"] | order(name asc)',
					),
					client.fetch(
						'*[_type == "jobField"] | order(name asc)',
					),
				]);

				setLocations(locationsData);
				setJobTypes(jobTypesData);
				setLevels(levelsData);
				setEducations(educationsData);
				setJobFields(jobFieldsData);
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
		<div className='dashboard-post-job-heading'>
			<h3 className='dashboard-form-heading'>Job Details</h3>

			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
				<FormField
					control={control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Location
							</FormLabel>
							<Select
								onValueChange={
									field.onChange
								}
								value={
									field.value
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select location' />
								</SelectTrigger>
								<SelectContent>
									{locations.map(
										(
											location,
										) => (
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
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='jobType'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Job Type
							</FormLabel>
							<Select
								onValueChange={
									field.onChange
								}
								value={
									field.value
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select job type' />
								</SelectTrigger>
								<SelectContent>
									{jobTypes.map(
										(
											type,
										) => (
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
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
				<FormField
					control={control}
					name='education'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Education Level
							</FormLabel>
							<Select
								onValueChange={
									field.onChange
								}
								value={
									field.value
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select education level' />
								</SelectTrigger>
								<SelectContent>
									{educations.map(
										(
											education,
										) => (
											<SelectItem
												key={
													education._id
												}
												value={
													education._id
												}>
												{
													education.name
												}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='jobField'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Job Field
							</FormLabel>
							<Select
								onValueChange={
									field.onChange
								}
								value={
									field.value
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select job field' />
								</SelectTrigger>
								<SelectContent>
									{jobFields.map(
										(
											field,
										) => (
											<SelectItem
												key={
													field._id
												}
												value={
													field._id
												}>
												{
													field.name
												}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
				<FormField
					control={control}
					name='level'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Experience Level
							</FormLabel>
							<Select
								onValueChange={
									field.onChange
								}
								value={
									field.value
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select experience level' />
								</SelectTrigger>
								<SelectContent>
									{levels.map(
										(
											level,
										) => (
											<SelectItem
												key={
													level._id
												}
												value={
													level._id
												}>
												{
													level.name
												}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div /> {/* Empty div for grid layout */}
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
