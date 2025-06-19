"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JobDraft } from "@/lib/hooks/useJobDraft";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicDetailsProps {
	register: UseFormRegister<JobDraft>;
	errors: FieldErrors<JobDraft>;
}

export default function BasicDetails({ register, errors }: BasicDetailsProps) {
	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium'>
				Basic Information
			</h3>

			<FormItem>
				<FormLabel>Job Title</FormLabel>
				<FormControl>
					<Input
						{...register("title")}
						placeholder='e.g., Senior Software Engineer'
					/>
				</FormControl>
				{errors.title && (
					<FormMessage>
						{errors.title.message}
					</FormMessage>
				)}
			</FormItem>

			<FormItem>
				<FormLabel>Job Summary</FormLabel>
				<FormControl>
					<Textarea
						{...register("summary")}
						placeholder='Provide a brief overview of the position'
						rows={4}
					/>
				</FormControl>
				{errors.summary && (
					<FormMessage>
						{errors.summary.message}
					</FormMessage>
				)}
			</FormItem>
		</div>
	);
}
