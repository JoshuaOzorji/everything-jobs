"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { JobSubmission } from "@/types";
import { client } from "@/sanity/lib/client";

// Component Imports
import BasicInformation from "./BasicInformation";
import JobDetails from "./JobDetails";
import RequirementsSection from "./RequirementsSection";
import JobClassification from "./JobClassification";
import ContactInformation from "./ContactInformation";
import SubmitButton from "./SubmitButton";
import ApplicationDetails from "./ApplicationDetails";

interface FormDataOptions {
	locations: { name: string }[];
	jobTypes: { name: string }[];
	educationLevels: { name: string }[];
	jobFields: { name: string }[];
	experienceLevels: { name: string }[];
}

export default function JobSubmissionForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formOptions, setFormOptions] = useState<FormDataOptions>({
		locations: [],
		jobTypes: [],
		educationLevels: [],
		jobFields: [],
		experienceLevels: [],
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<JobSubmission>();

	useEffect(() => {
		async function fetchFormOptions() {
			try {
				const [
					locations,
					jobTypes,
					educationLevels,
					jobFields,
					experienceLevels,
				] = await Promise.all([
					client.fetch(
						`*[_type == "state"]{name}`,
					),
					client.fetch(
						`*[_type == "jobType"]{name} | order(name asc)`,
					),
					client.fetch(
						`*[_type == "education"]{name} | order(name asc)`,
					),
					client.fetch(
						`*[_type == "jobField"]{name} | order(name asc)`,
					),
					client.fetch(
						`*[_type == "jobLevel"]{name} | order(name asc)`,
					),
				]);

				setFormOptions({
					locations,
					jobTypes,
					educationLevels,
					jobFields,
					experienceLevels,
				});
			} catch (error) {
				console.error(
					"Error fetching form options:",
					error,
				);
				toast.error("Error fetching form options");
			}
		}

		fetchFormOptions();
	}, []);

	const onSubmit = async (data: JobSubmission) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/jobs/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.error || "Failed to submit job",
				);
			}

			toast.success("Job Submission Successful", {
				description:
					"Your job posting is now pending admin approval",
				action: {
					label: "Close",
					onClick: () => toast.dismiss(),
				},
			});
			reset();
		} catch (error) {
			toast.error("Submission Failed", {
				description:
					error instanceof Error
						? error.message
						: "Please try again later",
				action: {
					label: "Retry",
					onClick: () => handleSubmit(onSubmit)(),
				},
			});
			console.error("Submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='max-w-2xl mx-auto p-6 space-y-6 font-poppins'>
			<BasicInformation register={register} errors={errors} />

			<JobDetails register={register} errors={errors} />

			<RequirementsSection
				register={register}
				errors={errors}
			/>

			<JobClassification
				register={register}
				errors={errors}
				formOptions={formOptions}
			/>

			<ApplicationDetails
				register={register}
				errors={errors}
			/>

			<ContactInformation
				register={register}
				errors={errors}
			/>

			<SubmitButton isSubmitting={isSubmitting} />
		</form>
	);
}
