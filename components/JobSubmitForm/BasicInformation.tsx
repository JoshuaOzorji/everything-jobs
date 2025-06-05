"use client";

import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import { JobSubmission } from "@/types/types";
import FormSection from "./FormSection";
import FormField from "./FormField";

interface BasicInformationProps {
	register: UseFormRegister<JobSubmission>;
	errors: FieldErrors<JobSubmission>;
}

export default function BasicInformation({
	register,
	errors,
}: BasicInformationProps) {
	return (
		<FormSection title='Basic Information'>
			<FormField
				label='Job Title'
				error={errors.title as FieldError}
				required>
				<input
					{...register("title", {
						required: "Job title is required",
					})}
					className='w-full px-3 py-2 rounded-md'
				/>
			</FormField>

			<FormField
				label='Job Summary'
				error={errors.summary as FieldError}
				required>
				<textarea
					{...register("summary", {
						required: "Summary is required",
					})}
					rows={4}
					className='w-full px-3 py-2 rounded-md'
				/>
			</FormField>

			<FormField
				label='Company Name'
				error={errors.companyName as FieldError}
				required>
				<input
					type='text'
					{...register("companyName", {
						required: "Company name is required",
					})}
					className='w-full px-3 py-2 rounded-md'
				/>
			</FormField>
		</FormSection>
	);
}
