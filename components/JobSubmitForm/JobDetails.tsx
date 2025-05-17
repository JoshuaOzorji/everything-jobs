"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { JobSubmission } from "@/types";
import FormSection from "./FormSection";
import FormField from "./FormField";

interface JobDetailsProps {
	register: UseFormRegister<JobSubmission>;
	errors: FieldErrors<JobSubmission>;
}

export default function JobDetails({ register, errors }: JobDetailsProps) {
	return (
		<FormSection title='Job Details'>
			<div className='grid grid-cols-2 gap-4'>
				<FormField
					label='Minimum Salary'
					error={errors.salaryRange?.min}
					required>
					<input
						type='number'
						{...register(
							"salaryRange.min",
							{
								required: "Minimum salary is required",
								min: {
									value: 0,
									message: "Salary cannot be negative",
								},
							},
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</FormField>

				<FormField
					label='Maximum Salary'
					error={errors.salaryRange?.max}
					required>
					<input
						type='number'
						{...register(
							"salaryRange.max",
							{
								required: "Maximum salary is required",
								min: {
									value: 0,
									message: "Salary cannot be negative",
								},
							},
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</FormField>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<FormField
					label='Minimum Experience (Years)'
					error={errors.experienceRange?.min}>
					<input
						type='number'
						{...register(
							"experienceRange.min",
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</FormField>

				<FormField
					label='Maximum Experience (Years)'
					error={errors.experienceRange?.max}>
					<input
						type='number'
						{...register(
							"experienceRange.max",
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</FormField>
			</div>
		</FormSection>
	);
}
