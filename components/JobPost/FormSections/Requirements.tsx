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
import { Textarea } from "@/components/ui/textarea";

interface RequirementsProps {
	register: UseFormRegister<JobDraft>;
	errors: FieldErrors<JobDraft>;
}

export default function Requirements({ register, errors }: RequirementsProps) {
	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium'>
				Requirements & Responsibilities
			</h3>

			<FormItem>
				<FormLabel>
					Requirements (one per line)
				</FormLabel>
				<FormControl>
					<Textarea
						{...register("requirements")}
						placeholder='Enter each requirement on a new line'
						rows={4}
					/>
				</FormControl>
				{errors.requirements && (
					<FormMessage>
						{errors.requirements.message}
					</FormMessage>
				)}
			</FormItem>

			<FormItem>
				<FormLabel>
					Responsibilities (one per line)
				</FormLabel>
				<FormControl>
					<Textarea
						{...register(
							"responsibilities",
						)}
						placeholder='Enter each responsibility on a new line'
						rows={4}
					/>
				</FormControl>
				{errors.responsibilities && (
					<FormMessage>
						{
							errors.responsibilities
								.message
						}
					</FormMessage>
				)}
			</FormItem>

			<FormItem>
				<FormLabel>
					Recruitment Process (one per line)
				</FormLabel>
				<FormControl>
					<Textarea
						{...register(
							"recruitmentProcess",
						)}
						placeholder='Enter each step of the recruitment process on a new line'
						rows={4}
					/>
				</FormControl>
				{errors.recruitmentProcess && (
					<FormMessage>
						{
							errors
								.recruitmentProcess
								.message
						}
					</FormMessage>
				)}
			</FormItem>
		</div>
	);
}
