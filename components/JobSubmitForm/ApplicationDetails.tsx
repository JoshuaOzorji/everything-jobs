import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { JobSubmission } from "@/types";

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

			<div className='space-y-2'>
				<label className='block text-sm font-medium'>
					Application Deadline
				</label>
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
							); // Reset time to start of day
							const selected =
								new Date(value);
							return (
								selected >=
									now ||
								"Deadline must be in the future"
							);
						},
					})}
					className='w-full rounded-md border p-2'
				/>
				{errors.deadline && (
					<p className='text-red-500 text-sm'>
						{errors.deadline.message}
					</p>
				)}
			</div>

			<div className='space-y-2'>
				<label className='block text-sm font-medium'>
					Method of Application*
				</label>
				<textarea
					{...register("apply", {
						required: "Method of application is required",
					})}
					placeholder='Explain how candidates should apply (e.g., email, website, or specific instructions)'
					rows={4}
					className='w-full rounded-md border p-2'
				/>
				{errors.apply && (
					<p className='text-red-500 text-sm'>
						{errors.apply.message}
					</p>
				)}
			</div>
		</div>
	);
}
