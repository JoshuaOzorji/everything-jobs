"use client";

import { ReactNode } from "react";

interface FormSectionProps {
	title: string;
	children: ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-semibold'>{title}</h2>
			{children}
		</div>
	);
}
