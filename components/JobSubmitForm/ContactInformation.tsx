"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { JobSubmission } from "@/types/types";
import FormSection from "./FormSection";
import FormField from "./FormField";

interface ContactInformationProps {
	register: UseFormRegister<JobSubmission>;
	errors: FieldErrors<JobSubmission>;
}

export default function ContactInformation({
	register,
	errors,
}: ContactInformationProps) {
	return (
		<FormSection title='Contact Information'>
			<FormField
				label='Your Name'
				error={errors.submitterInfo?.name}
				required>
				<input
					{...register("submitterInfo.name", {
						required: "Name is required",
					})}
					className='w-full px-3 py-2 border rounded-md'
				/>
			</FormField>

			<FormField
				label='Your Email'
				error={errors.submitterInfo?.email}
				required>
				<input
					type='email'
					{...register("submitterInfo.email", {
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					})}
					className='w-full px-3 py-2 border rounded-md'
				/>
			</FormField>

			<FormField
				label='Phone Number'
				error={errors.submitterInfo?.phoneNumber}>
				<input
					{...register(
						"submitterInfo.phoneNumber",
					)}
					className='w-full px-3 py-2 border rounded-md'
				/>
			</FormField>
		</FormSection>
	);
}
