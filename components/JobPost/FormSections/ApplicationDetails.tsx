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

interface ApplicationDetailsProps {
	register: UseFormRegister<JobDraft>;
	errors: FieldErrors<JobDraft>;
}

export default function ApplicationDetails({
	register,
	errors,
}: ApplicationDetailsProps) {
	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium'>
				Application Details
			</h3>

			<FormItem>
				<FormLabel>Application Deadline</FormLabel>
				<FormControl>
					<Input
						type='date'
						{...register("deadline")}
						min={
							new Date()
								.toISOString()
								.split("T")[0]
						}
					/>
				</FormControl>
				{errors.deadline && (
					<FormMessage>
						{errors.deadline.message}
					</FormMessage>
				)}
			</FormItem>

			<FormItem>
				<FormLabel>Application Instructions</FormLabel>
				<FormControl>
					<Textarea
						{...register("apply")}
						placeholder='Provide detailed instructions on how to apply for this position'
						rows={4}
					/>
				</FormControl>
				{errors.apply && (
					<FormMessage>
						{errors.apply.message}
					</FormMessage>
				)}
			</FormItem>
		</div>
	);
}
