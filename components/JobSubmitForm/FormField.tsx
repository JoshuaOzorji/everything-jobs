"use client";

import { ReactNode } from "react";
import { FieldError, FieldErrors } from "react-hook-form";

interface FormFieldProps {
	label: string;
	children: ReactNode;
	error?: FieldError | FieldErrors<any> | undefined;
	required?: boolean;
}

export default function FormField({
	label,
	children,
	error,
	required = false,
}: FormFieldProps) {
	const getErrorMessage = (error: FormFieldProps["error"]) => {
		if (!error) return undefined;
		if ("message" in error) return error.message;
		if (Array.isArray(error)) return error[0]?.message;
		return undefined;
	};

	const errorMessage = getErrorMessage(error);

	return (
		<div className='form-field-wrapper'>
			<label className='block text-sm font-medium mb-2'>
				{label} {required && "*"}
			</label>
			{children}
			{errorMessage && (
				<p className='text-red-500 text-sm mt-1'>
					{errorMessage}
				</p>
			)}
		</div>
	);
}
