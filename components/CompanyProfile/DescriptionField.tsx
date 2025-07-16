"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CompanyProfileUpdate } from "@/types/types";
import { FormField } from "./FormField";

interface DescriptionFieldProps {
	register: UseFormRegister<CompanyProfileUpdate>;
	errors: FieldErrors<CompanyProfileUpdate>;
	isEditMode: boolean;
	currentValue?: string;
}

export function DescriptionField({
	register,
	errors,
	isEditMode,
	currentValue,
}: DescriptionFieldProps) {
	return (
		<FormField label='Description' error={errors.description}>
			{isEditMode ? (
				<textarea
					{...register("description")}
					rows={4}
					className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none'
					placeholder='Tell us about your company...'
				/>
			) : (
				<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 min-h-[100px]'>
					{currentValue ||
						"No description provided"}
				</div>
			)}
		</FormField>
	);
}
