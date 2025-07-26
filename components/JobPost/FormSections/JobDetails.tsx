"use client";

import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { JobDraft } from "@/lib/hooks/useJobDraft";
import { useReferenceData } from "@/hooks/useReferenceData";
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
	control: Control<JobDraft>;
}

export default function JobDetails({
	register,
	errors,
	control,
}: JobDetailsProps) {
	const { data: referenceData, isError } = useReferenceData();

	// Provide fallback empty arrays while data is loading or on error
	const locations = referenceData?.locations || [];
	const jobTypes = referenceData?.jobTypes || [];
	const levels = referenceData?.levels || [];
	const educations = referenceData?.educations || [];
	const jobFields = referenceData?.jobFields || [];

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
								}
								disabled={
									isError
								}>
								<SelectTrigger>
									<SelectValue
										placeholder={
											isError
												? "Error loading locations"
												: locations.length ===
													  0
													? "Loading locations..."
													: "Select location"
										}
									/>
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
								}
								disabled={
									isError
								}>
								<SelectTrigger>
									<SelectValue
										placeholder={
											isError
												? "Error loading job types"
												: jobTypes.length ===
													  0
													? "Loading job types..."
													: "Select job type"
										}
									/>
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
								}
								disabled={
									isError
								}>
								<SelectTrigger>
									<SelectValue
										placeholder={
											isError
												? "Error loading education levels"
												: educations.length ===
													  0
													? "Loading education levels..."
													: "Select education level"
										}
									/>
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
								}
								disabled={
									isError
								}>
								<SelectTrigger>
									<SelectValue
										placeholder={
											isError
												? "Error loading job fields"
												: jobFields.length ===
													  0
													? "Loading job fields..."
													: "Select job field"
										}
									/>
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
								}
								disabled={
									isError
								}>
								<SelectTrigger>
									<SelectValue
										placeholder={
											isError
												? "Error loading experience levels"
												: levels.length ===
													  0
													? "Loading experience levels..."
													: "Select experience level"
										}
									/>
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
