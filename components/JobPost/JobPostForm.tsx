"use client";

import { useEffect, useState, useRef } from "react";
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
import { LoadingComponent } from "@/components/Loading";

export default function JobPostForm() {
	const { data: session } = useSession();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { draft, saveDraft, clearDraft, isLoaded } = useJobDraft();
	const hasInitialized = useRef(false);
	const formRef = useRef<HTMLFormElement>(null);

	const form = useForm<JobDraft>({
		resolver: zodResolver(jobValidationSchema),
		mode: "onChange",
		defaultValues: {
			title: "",
			summary: "",
			location: "",
			jobType: "",
			education: "",
			jobField: "",
			level: "",
			deadline: "",
			salaryRange: { min: 0, max: 0 },
			requirements: "",
			responsibilities: "",
			recruitmentProcess: "",
			apply: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
		reset,
		control,
	} = form;

	// Debug: Log form errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form validation errors:", errors);
		}
	}, [errors]);

	// Initialize form with draft data when it's loaded
	useEffect(() => {
		if (isLoaded && !hasInitialized.current) {
			if (draft) {
				console.log(
					"🔄 Initializing form with draft data:",
					draft,
				);
				reset(draft);
			} else {
				console.log(
					"🔄 Initializing form with default values",
				);
				// Reset to ensure form is properly initialized even without draft
				reset({
					title: "",
					summary: "",
					location: "",
					jobType: "",
					education: "",
					jobField: "",
					level: "",
					deadline: "",
					salaryRange: { min: 0, max: 0 },
					requirements: "",
					responsibilities: "",
					recruitmentProcess: "",
					apply: "",
				});
			}
			hasInitialized.current = true;
		}
	}, [isLoaded, draft, reset]);

	// Watch form values for draft saving
	const watchedValues = useWatch({ control });
	const debouncedValues = useDebounce(watchedValues, 1000);

	// Save draft when form values change
	useEffect(() => {
		// Only save after initialization, if form is dirty, and we have valid data
		if (
			hasInitialized.current &&
			isDirty &&
			debouncedValues &&
			isLoaded
		) {
			console.log(
				"💾 Saving draft with values:",
				debouncedValues,
			);
			saveDraft(debouncedValues);
		}
	}, [debouncedValues, isDirty, saveDraft, isLoaded]);

	// Handle page unload to save draft
	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (isDirty && hasInitialized.current) {
				const currentValues = form.getValues();
				saveDraft(currentValues);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () =>
			window.removeEventListener(
				"beforeunload",
				handleBeforeUnload,
			);
	}, [isDirty, saveDraft, form]);

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
			const summary = stringToBlocks(data.summary ?? "");
			const requirements = stringToArray(
				data.requirements ?? "",
			);
			const responsibilities = stringToArray(
				data.responsibilities ?? "",
			);
			const recruitmentProcess = stringToArray(
				data.recruitmentProcess ?? "",
			);
			const apply = stringToBlocks(data.apply ?? "");

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

			// Clear draft after successful submission
			clearDraft();

			// Reset form to default values
			reset({
				title: "",
				summary: "",
				location: "",
				jobType: "",
				education: "",
				jobField: "",
				level: "",
				deadline: "",
				salaryRange: { min: 0, max: 0 },
				requirements: "",
				responsibilities: "",
				recruitmentProcess: "",
				apply: "",
			});

			hasInitialized.current = false; // Allow re-initialization
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

	// Show loading state while draft is being loaded
	if (!isLoaded) {
		return <LoadingComponent />;
	}

	return (
		<Form {...form}>
			<form
				ref={formRef}
				onSubmit={handleSubmit(onSubmit, onError)}
				className='space-y-6'>
				<BasicDetails
					register={register}
					errors={errors}
				/>
				<JobDetails
					register={register}
					errors={errors}
					control={control}
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
						type='button'
						onClick={() => {
							clearDraft();
							reset({
								title: "",
								summary: "",
								location: "",
								jobType: "",
								education: "",
								jobField: "",
								level: "",
								deadline: "",
								salaryRange: {
									min: 0,
									max: 0,
								},
								requirements:
									"",
								responsibilities:
									"",
								recruitmentProcess:
									"",
								apply: "",
							});
						}}
						className='inline-flex px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pry'>
						Clear Draft
					</button>
					<button
						type='submit'
						disabled={
							isSubmitting || !isValid
						}
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
