"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { JobDraft } from "@/lib/hooks/useJobDraft";
import {
	FormControl,
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
		<div className='dashboard-post-job-heading'>
			<h3 className='dashboard-form-heading'>
				Requirements & Responsibilities
			</h3>

			<FormItem>
				<FormLabel>
					Responsibilities{" "}
					<span className='italic'>
						(Duties and Tasks)
					</span>
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
					Requirements{" "}
					<span className='italic'>
						(Ideal Candidate)
					</span>
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
					Recruitment Process{" "}
					<span className='italic'>
						(Optional)
					</span>
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
