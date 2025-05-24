import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { JobSubmission } from "@/types";
import FormField from "./FormField";

interface ApplicationDetailsProps {
	register: UseFormRegister<JobSubmission>;
	errors: FieldErrors<JobSubmission>;
}

export default function ApplicationDetails({
	register,
	errors,
}: ApplicationDetailsProps) {
	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-semibold'>
				Application Details
			</h2>

			<FormField
				label='Application Deadline'
				error={errors.deadline}>
				<input
					type='date'
					{...register("deadline", {
						validate: (value) => {
							if (!value) return true;
							const now = new Date();
							now.setHours(
								0,
								0,
								0,
								0,
							);
							const selected =
								new Date(value);
							return (
								selected >=
									now ||
								"Deadline must be in the future"
							);
						},
					})}
					className='w-full rounded-md p-2'
				/>
			</FormField>

			<FormField
				label='Method of Application'
				error={errors.apply}
				required>
				<textarea
					{...register("apply", {
						required: "Method of application is required",
					})}
					placeholder='Explain how candidates should apply (e.g., email, website, or specific instructions)'
					rows={4}
					className='w-full rounded-md p-2'
				/>
			</FormField>
		</div>
	);
}
