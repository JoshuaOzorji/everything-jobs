"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CompanyProfileUpdate } from "@/types/types";
import { FormField } from "./FormField";

interface CompanyNameFieldProps {
	register: UseFormRegister<CompanyProfileUpdate>;
	errors: FieldErrors<CompanyProfileUpdate>;
	isEditMode: boolean;
	currentValue: string;
}

export function CompanyNameField({
	register,
	errors,
	isEditMode,
	currentValue,
}: CompanyNameFieldProps) {
	return (
		<FormField label='Company Name' required error={errors.name}>
			{isEditMode ? (
				<input
					{...register("name", {
						required: "Company name is required",
					})}
					className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
					placeholder='Enter your company name'
				/>
			) : (
				<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900'>
					{currentValue || "Not specified"}
				</div>
			)}
		</FormField>
	);
}
