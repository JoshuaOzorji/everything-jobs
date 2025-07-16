"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CompanyProfileUpdate } from "@/types/types";
import { FormField } from "./FormField";
import { formatURL } from "@/lib/utils";

interface WebsiteFieldProps {
	register: UseFormRegister<CompanyProfileUpdate>;
	errors: FieldErrors<CompanyProfileUpdate>;
	isEditMode: boolean;
	currentValue?: string;
}

export function WebsiteField({
	register,
	errors,
	isEditMode,
	currentValue,
}: WebsiteFieldProps) {
	return (
		<FormField label='Website' error={errors.website}>
			{isEditMode ? (
				<input
					type='text'
					{...register("website", {
						pattern: {
							value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/,
							message: "Please enter a valid URL",
						},
					})}
					onBlur={(e) => {
						e.target.value = formatURL(
							e.target.value,
						);
					}}
					className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
					placeholder='https://yourcompany.com'
				/>
			) : (
				<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900'>
					{currentValue ? (
						<a
							href={currentValue}
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-600 hover:text-blue-800 hover:underline'>
							{currentValue}
						</a>
					) : (
						"Not specified"
					)}
				</div>
			)}
		</FormField>
	);
}
