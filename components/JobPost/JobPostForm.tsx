"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useWatch } from "react-hook-form";
import { useJobDraft, type JobDraft } from "@/lib/hooks/useJobDraft";
import { jobValidationSchema } from "@/lib/validation/jobValidationSchema";
import { Form } from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebounce";
import BasicDetails from "./FormSections/BasicDetails";
import JobDetails from "./FormSections/JobDetails";
import Requirements from "./FormSections/Requirements";
import ApplicationDetails from "./FormSections/ApplicationDetails";

export default function JobPostForm() {
	const { data: session } = useSession();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { draft, saveDraft, clearDraft, isLoaded } = useJobDraft();
	const hasInitialized = useRef(false);

	const form = useForm<JobDraft>({
		resolver: zodResolver(jobValidationSchema),
		mode: "onChange", // Enable real-time validation
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
		reset,
	} = form;

	// Debug: Log form errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form validation errors:", errors);
		}
	}, [errors]);

	// Reset form with draft data when it's loaded
	useEffect(() => {
		if (isLoaded && draft && !hasInitialized.current) {
			reset(draft);
			hasInitialized.current = true;
		}
	}, [isLoaded, draft, reset]);

	const watchedValues = useWatch({ control: form.control });
	const debouncedValues = useDebounce(watchedValues, 1000);

	const memoizedSaveDraft = useCallback(saveDraft, [saveDraft]);

	useEffect(() => {
		// Only save after initialization and if form is dirty
		if (hasInitialized.current && isDirty && debouncedValues) {
			memoizedSaveDraft(debouncedValues);
		}
	}, [debouncedValues, isDirty, memoizedSaveDraft]);

	const onSubmit: SubmitHandler<JobDraft> = async (data) => {
		console.log("Form submitted with data:", data);
		setIsSubmitting(true);

		try {
			// Helper function to convert string to string array
			const stringToArray = (text: string): string[] => {
				return text
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean);
			};

			// Helper function to convert string to Sanity block format
			const stringToBlocks = (text: string) => {
				const paragraphs = text
					.split("\n\n")
					.map((p) => p.trim())
					.filter(Boolean);

				return paragraphs.map((paragraph) => ({
					_type: "block",
					_key: `block-${Math.random().toString(36).substring(2, 11)}`,
					style: "normal",
					markDefs: [],
					children: [
						{
							_type: "span",
							_key: `span-${Math.random().toString(36).slice(2, 11)}`,
							text: paragraph,
							marks: [],
						},
					],
				}));
			};

			// Transform data for Sanity
			const summary = stringToBlocks(data.summary);
			const requirements = stringToArray(data.requirements);
			const responsibilities = stringToArray(
				data.responsibilities,
			);
			const recruitmentProcess = stringToArray(
				data.recruitmentProcess,
			);
			const apply = stringToBlocks(data.apply);

			// Transform data to match Sanity schema expectations
			const submitData = {
				title: data.title,
				summary,
				requirements,
				responsibilities,
				recruitmentProcess,
				apply,
				// Reference fields - create proper reference objects
				location: {
					_type: "reference",
					_ref: data.location,
				},
				jobType: {
					_type: "reference",
					_ref: data.jobType,
				},
				education: {
					_type: "reference",
					_ref: data.education,
				},
				jobField: {
					_type: "reference",
					_ref: data.jobField,
				},
				level: { _type: "reference", _ref: data.level },
				// Other fields
				deadline: data.deadline,
				salaryRange: data.salaryRange,
				company: {
					_type: "reference",
					_ref: session?.user?.companyId,
				},
			};

			console.log("Submitting processed data:", submitData);

			const response = await fetch("/api/jobs/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(submitData),
			});

			console.log("API response status:", response.status);

			if (!response.ok) {
				const errorData = await response.json();
				console.error("API error:", errorData);
				throw new Error(
					errorData.error ||
						"Failed to submit job",
				);
			}

			const result = await response.json();
			console.log("API result:", result);

			toast.success("Job Submitted Successfully", {
				description:
					"Your job posting is now pending approval",
			});
			clearDraft();
		} catch (error) {
			console.error("Submission error:", error);
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

	// Handle form submission errors
	const onError = (errors: any) => {
		console.log("Form validation failed:", errors);
		toast.error("Form Validation Failed", {
			description: "Please check all required fields",
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className='space-y-6'>
				<BasicDetails
					register={register}
					errors={errors}
				/>
				<JobDetails
					register={register}
					errors={errors}
					control={form.control}
				/>
				<Requirements
					register={register}
					errors={errors}
				/>
				<ApplicationDetails
					register={register}
					errors={errors}
				/>

				{/* Debug: Show validation errors */}
				{Object.keys(errors).length > 0 && (
					<div className='bg-red-50 border border-red-200 rounded-md p-4'>
						<h3 className='text-red-800 font-medium mb-2'>
							Please fix the following
							errors:
						</h3>
						<ul className='text-red-700 text-sm space-y-1'>
							{Object.entries(
								errors,
							).map(
								([
									key,
									error,
								]) => (
									<li
										key={
											key
										}>
										{
											key
										}

										:{" "}
										{error?.message ||
											"Invalid value"}
									</li>
								),
							)}
						</ul>
					</div>
				)}

				<div className='flex justify-end gap-4'>
					<button
						type='submit'
						disabled={isSubmitting}
						className='inline-flex px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-pry hover:bg-pry2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pry disabled:opacity-50'>
						{isSubmitting
							? "Submitting..."
							: "Submit Job"}
					</button>
				</div>
			</form>
		</Form>
	);
}
