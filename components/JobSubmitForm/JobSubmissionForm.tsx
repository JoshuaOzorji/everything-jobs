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

			if (result.success) {
				toast.success(
					"Job submitted successfully! Pending admin approval.",
				);
				reset();
			} else {
				toast.error(
					result.error || "Failed to submit job",
				);
			}
		} catch (error) {
			toast.error("Error submitting job");
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

			<ContactInformation
				register={register}
				errors={errors}
			/>

			<SubmitButton isSubmitting={isSubmitting} />
		</form>
	);
}
