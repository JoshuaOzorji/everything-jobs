"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CompanyProfileUpdate, Industry } from "@/types/types";
import { FormField } from "./FormField";

interface IndustryFieldProps {
	register: UseFormRegister<CompanyProfileUpdate>;
	errors: FieldErrors<CompanyProfileUpdate>;
	isEditMode: boolean;
	industries: Industry[];
	currentValue: string;
	selectedIndustryName: string;
}

export function IndustryField({
	register,
	errors,
	isEditMode,
	industries,
	currentValue,
	selectedIndustryName,
}: IndustryFieldProps) {
	return (
		<FormField label='Industry' required error={errors.industry}>
			{isEditMode ? (
				<select
					{...register("industry", {
						required: "Industry is required",
					})}
					className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'>
					<option value=''>
						Select Industry
					</option>
					{industries.map((industry) => (
						<option
							key={industry._id}
							value={industry._id}>
							{industry.name}
						</option>
					))}
				</select>
			) : (
				<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900'>
					{selectedIndustryName}
				</div>
			)}
		</FormField>
	);
}
