"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CompanyProfileUpdate, Industry } from "@/types/types";
import { uploadImageToSanity } from "@/lib/uploadImageToSanity";
import { client } from "@/sanity/lib/client";

interface CompanyProfileFormProps {
	initialData?: {
		_id: string;
		name: string;
		website?: string;
		industry?: { _id: string };
		description?: string;
		logo?: any;
	};
}

export default function CompanyProfileForm({
	initialData,
}: CompanyProfileFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [industries, setIndustries] = useState<Industry[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CompanyProfileUpdate>({
		defaultValues: {
			name: initialData?.name,
			website: initialData?.website,
			industry: initialData?.industry?._id,
			description: initialData?.description,
		},
	});

	useEffect(() => {
		async function fetchIndustries() {
			try {
				const result = await client.fetch<Industry[]>(`
          *[_type == "industry"] {
            _id,
            name
          } | order(name asc)
        `);
				setIndustries(result);
			} catch (error) {
				toast.error("Failed to load industries");
			}
		}

		fetchIndustries();
	}, []);

	const onSubmit = async (data: CompanyProfileUpdate) => {
		setIsSubmitting(true);
		try {
			let logoAsset = null;
			if (data.logo?.[0]) {
				logoAsset = await uploadImageToSanity(
					data.logo[0],
				);
			}

			const companyData = {
				_id: initialData?._id,
				name: data.name,
				website: data.website,
				industry: {
					_type: "reference",
					_ref: data.industry,
				},
				description: data.description,
				...(logoAsset && { logo: logoAsset }),
			};

			const response = await fetch("/api/company/update", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(companyData),
			});

			if (!response.ok) {
				throw new Error(
					"Failed to update company profile",
				);
			}

			toast.success("Profile Updated", {
				description:
					"Your company profile has been updated successfully",
			});
		} catch (error) {
			toast.error("Update Failed", {
				description:
					error instanceof Error
						? error.message
						: "Please try again later",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			{/* Company Name */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>
					Company Name
				</label>
				<input
					{...register("name", {
						required: "Company name is required",
					})}
					className='w-full px-3 py-2 border rounded-md'
				/>
				{errors.name && (
					<p className='text-sm text-red-500'>
						{errors.name.message}
					</p>
				)}
			</div>

			{/* Website */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>
					Website
				</label>
				<input
					type='url'
					{...register("website", {
						pattern: {
							value: /^https?:\/\/.+\..+/,
							message: "Please enter a valid URL",
						},
					})}
					className='w-full px-3 py-2 border rounded-md'
				/>
				{errors.website && (
					<p className='text-sm text-red-500'>
						{errors.website.message}
					</p>
				)}
			</div>

			{/* Industry */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>
					Industry
				</label>
				<select
					{...register("industry", {
						required: "Industry is required",
					})}
					className='w-full px-3 py-2 border rounded-md'>
					<option value=''>
						Select Industry
					</option>
					{industries.map((industry) => (
						<option
							key={industry._id}
							value={industry._id}>
							{industry.name}
						</option>
					))}
				</select>
				{errors.industry && (
					<p className='text-sm text-red-500'>
						{errors.industry.message}
					</p>
				)}
			</div>

			{/* Description */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>
					Description
				</label>
				<textarea
					{...register("description")}
					rows={4}
					className='w-full px-3 py-2 border rounded-md'
				/>
			</div>

			{/* Logo Upload */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>
					Company Logo
				</label>
				<input
					type='file'
					accept='image/*'
					{...register("logo", {
						validate: {
							fileSize: (files) => {
								if (!files?.[0])
									return true;
								return (
									files[0]
										.size <=
										5000000 ||
									"Image must be less than 5MB"
								);
							},
							fileType: (files) => {
								if (!files?.[0])
									return true;
								return (
									[
										"image/jpeg",
										"image/png",
										"image/gif",
									].includes(
										files[0]
											.type,
									) ||
									"Unsupported file format"
								);
							},
						},
					})}
					className='w-full px-3 py-2 border rounded-md'
				/>
				{errors.logo && (
					<p className='text-sm text-red-500'>
						{errors.logo.message}
					</p>
				)}
			</div>

			<button
				type='submit'
				disabled={isSubmitting}
				className='w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300'>
				{isSubmitting
					? "Updating..."
					: "Update Profile"}
			</button>
		</form>
	);
}
