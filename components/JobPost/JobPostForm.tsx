"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useJobDraft, type JobDraft } from "@/lib/hooks/useJobDraft";
import { jobValidationSchema } from "@/lib/validation/jobValidationSchema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BasicDetails from "./FormSections/BasicDetails";
import JobDetails from "./FormSections/JobDetails";
import Requirements from "./FormSections/Requirements";
import ApplicationDetails from "./FormSections/ApplicationDetails";

export default function JobPostForm() {
	const { data: session } = useSession();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { draft, saveDraft, clearDraft } = useJobDraft();

	const form = useForm<JobDraft>({
		resolver: zodResolver(jobValidationSchema),
		defaultValues: draft || undefined,
	});

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isDirty },
	} = form;

	// Auto-save draft when form changes
	const formValues = watch();
	useEffect(() => {
		if (isDirty) {
			saveDraft(formValues);
		}
	}, [formValues, isDirty, saveDraft]);

	const onSubmit = async (data: JobDraft) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/jobs/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					company: {
						_type: "reference",
						_ref: session?.user?.companyId,
					},
				}),
			});

			if (!response.ok)
				throw new Error("Failed to submit job");

			toast.success("Job Submitted Successfully", {
				description:
					"Your job posting is now pending approval",
			});
			clearDraft();
		} catch (error) {
			toast.error("Submission Failed", {
				description:
					error instanceof Error
						? error.message
						: "Please try again",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-8'>
				<BasicDetails
					register={register}
					errors={errors}
				/>
				<JobDetails
					register={register}
					errors={errors}
				/>
				<Requirements
					register={register}
					errors={errors}
				/>
				<ApplicationDetails
					register={register}
					errors={errors}
				/>

				<div className='flex justify-end gap-4'>
					<Button
						type='submit'
						disabled={isSubmitting}
						className='bg-primary'>
						{isSubmitting
							? "Submitting..."
							: "Submit Job"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
