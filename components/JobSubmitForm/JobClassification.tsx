"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { JobSubmission } from "@/types";
import FormSection from "./FormSection";
import FormField from "./FormField";

interface FormDataOptions {
	locations: { name: string }[];
	jobTypes: { name: string }[];
	educationLevels: { name: string }[];
	jobFields: { name: string }[];
	experienceLevels: { name: string }[];
}

interface JobClassificationProps {
	register: UseFormRegister<JobSubmission>;
	errors: FieldErrors<JobSubmission>;
	formOptions: FormDataOptions;
}

export default function JobClassification({
	register,
	errors,
	formOptions,
}: JobClassificationProps) {
	return (
		<FormSection title='Job Classification'>
			<div className='grid grid-cols-2 gap-4'>
				<FormField
					label='Location'
					error={errors.locationName}
					required>
					<select
						{...register("locationName", {
							required: "Location is required",
						})}
						className='w-full px-3 py-2 border rounded-md'>
						<option value=''>
							Select Location
						</option>
						{formOptions.locations.map(
							(location) => (
								<option
									key={
										location.name
									}
									value={
										location.name
									}>
									{
										location.name
									}
								</option>
							),
						)}
					</select>
				</FormField>

				<FormField
					label='Job Type'
					error={errors.jobTypeName}
					required>
					<select
						{...register("jobTypeName", {
							required: "Job type is required",
						})}
						className='w-full px-3 py-2 border rounded-md'>
						<option value=''>
							Select Job Type
						</option>
						{formOptions.jobTypes.map(
							(type) => (
								<option
									key={
										type.name
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
				</FormField>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<FormField
					label='Education Level'
					error={errors.educationLevel}
					required>
					<select
						{...register("educationLevel", {
							required: "Education level is required",
						})}
						className='w-full px-3 py-2 border rounded-md'>
						<option value=''>
							Select Education Level
						</option>
						{formOptions.educationLevels.map(
							(education) => (
								<option
									key={
										education.name
									}
									value={
										education.name
									}>
									{
										education.name
									}
								</option>
							),
						)}
					</select>
				</FormField>

				<FormField
					label='Job Field'
					error={errors.jobFieldName}
					required>
					<select
						{...register("jobFieldName", {
							required: "Job field is required",
						})}
						className='w-full px-3 py-2 border rounded-md'>
						<option value=''>
							Select Job Field
						</option>
						{formOptions.jobFields.map(
							(field) => (
								<option
									key={
										field.name
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
				</FormField>
			</div>

			<FormField
				label='Experience Level'
				error={errors.experienceLevel}
				required>
				<select
					{...register("experienceLevel", {
						required: "Experience level is required",
					})}
					className='w-full px-3 py-2 border rounded-md'>
					<option value=''>
						Select Experience Level
					</option>
					{formOptions.experienceLevels.map(
						(level) => (
							<option
								key={level.name}
								value={
									level.name
								}>
								{level.name}
							</option>
						),
					)}
				</select>
			</FormField>
		</FormSection>
	);
}
