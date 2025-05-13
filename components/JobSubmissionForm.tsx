"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { JobSubmission } from "@/types";

export default function JobSubmissionForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<JobSubmission>();

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
			className='max-w-2xl mx-auto p-6 space-y-6'>
			{/* Basic Job Information */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>
					Basic Information
				</h2>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Job Title *
					</label>
					<input
						{...register("title", {
							required: "Job title is required",
						})}
						className='w-full px-3 py-2 border rounded-md'
					/>
					{errors.title && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.title.message}
						</p>
					)}
				</div>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Job Summary *
					</label>
					<textarea
						{...register("summary", {
							required: "Summary is required",
						})}
						rows={4}
						className='w-full px-3 py-2 border rounded-md'
					/>
					{errors.summary && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.summary.message}
						</p>
					)}
				</div>

				{/* Company Information */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Company Name *
					</label>
					<input
						type='text'
						{...register("companyName", {
							required: "Company name is required",
						})}
						className='w-full px-3 py-2 border rounded-md'
					/>
					{errors.companyName && (
						<p className='text-red-500 text-sm mt-1'>
							{
								errors
									.companyName
									.message
							}
						</p>
					)}
				</div>
			</div>

			{/* Job Details */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>
					Job Details
				</h2>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							Minimum Salary *
						</label>
						<input
							type='number'
							{...register(
								"salaryRange.min",
								{
									required: "Minimum salary is required",
									min: {
										value: 0,
										message: "Salary cannot be negative",
									},
								},
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>
							Maximum Salary *
						</label>
						<input
							type='number'
							{...register(
								"salaryRange.max",
								{
									required: "Maximum salary is required",
									min: {
										value: 0,
										message: "Salary cannot be negative",
									},
								},
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							Minimum Experience
							(Years)
						</label>
						<input
							type='number'
							{...register(
								"experienceRange.min",
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>
							Maximum Experience
							(Years)
						</label>
						<input
							type='number'
							{...register(
								"experienceRange.max",
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
					</div>
				</div>
			</div>

			{/* Requirements and Responsibilities */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>
					Requirements & Responsibilities
				</h2>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Requirements *
					</label>
					<textarea
						{...register("requirements", {
							required: "Requirements are required",
						})}
						placeholder='Enter each requirement on a new line'
						rows={4}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Responsibilities
					</label>
					<textarea
						{...register(
							"responsibilities",
						)}
						placeholder='Enter each responsibility on a new line'
						rows={4}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</div>
			</div>

			{/* Job Classification */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>
					Job Classification
				</h2>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							Location *
						</label>
						<input
							type='text'
							{...register(
								"locationName",
								{
									required: "Location is required",
								},
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
						{errors.locationName && (
							<p className='text-red-500 text-sm mt-1'>
								{
									errors
										.locationName
										.message
								}
							</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>
							Job Type *
						</label>
						<input
							type='text'
							{...register(
								"jobTypeName",
								{
									required: "Job type is required",
								},
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
						{errors.jobTypeName && (
							<p className='text-red-500 text-sm mt-1'>
								{
									errors
										.jobTypeName
										.message
								}
							</p>
						)}
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							Education Level *
						</label>
						<input
							type='text'
							{...register(
								"educationLevel",
								{
									required: "Education level is required",
								},
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
						{errors.educationLevel && (
							<p className='text-red-500 text-sm mt-1'>
								{
									errors
										.educationLevel
										.message
								}
							</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>
							Job Field *
						</label>
						<input
							type='text'
							{...register(
								"jobFieldName",
								{
									required: "Job field is required",
								},
							)}
							className='w-full px-3 py-2 border rounded-md'
						/>
						{errors.jobFieldName && (
							<p className='text-red-500 text-sm mt-1'>
								{
									errors
										.jobFieldName
										.message
								}
							</p>
						)}
					</div>
				</div>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Experience Level *
					</label>
					<input
						type='text'
						{...register(
							"experienceLevel",
							{
								required: "Experience level is required",
							},
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
					{errors.experienceLevel && (
						<p className='text-red-500 text-sm mt-1'>
							{
								errors
									.experienceLevel
									.message
							}
						</p>
					)}
				</div>
			</div>

			{/* Submitter Information */}
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>
					Contact Information
				</h2>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Your Name *
					</label>
					<input
						{...register(
							"submitterInfo.name",
							{
								required: "Name is required",
							},
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Your Email *
					</label>
					<input
						type='email'
						{...register(
							"submitterInfo.email",
							{
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								},
							},
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium mb-2'>
						Phone Number
					</label>
					<input
						{...register(
							"submitterInfo.phoneNumber",
						)}
						className='w-full px-3 py-2 border rounded-md'
					/>
				</div>
			</div>

			<button
				type='submit'
				disabled={isSubmitting}
				className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300'>
				{isSubmitting ? "Submitting..." : "Submit Job"}
			</button>
		</form>
	);
}
