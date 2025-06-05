"use client";

import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import { JobSubmission } from "@/types/types";
import FormSection from "./FormSection";
import FormField from "./FormField";

interface RequirementsSectionProps {
	register: UseFormRegister<JobSubmission>;
	errors: FieldErrors<JobSubmission>;
}

export default function RequirementsSection({
	register,
	errors,
}: RequirementsSectionProps) {
	return (
		<FormSection title='Requirements & Responsibilities'>
			<FormField
				label='Requirements'
				error={
					errors.requirements as
						| FieldError
						| undefined
				}
				required>
				<textarea
					{...register("requirements", {
						required: "Requirements are required",
					})}
					placeholder='Enter each requirement on a new line'
					rows={4}
					className='w-full px-3 py-2 border rounded-md'
				/>
			</FormField>

			<FormField
				label='Responsibilities'
				error={
					errors.responsibilities as
						| FieldError
						| undefined
				}>
				<textarea
					{...register("responsibilities")}
					placeholder='Enter each responsibility on a new line'
					rows={4}
					className='w-full px-3 py-2 border rounded-md'
				/>
			</FormField>
		</FormSection>
	);
}
