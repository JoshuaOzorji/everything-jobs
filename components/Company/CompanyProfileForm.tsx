"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CompanyProfileUpdate, Industry } from "@/types/types";
import { uploadImageToSanity } from "@/lib/uploadImageToSanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { formatURL } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CompanyProfileFormProps {
	initialData?: {
		_id: string;
		name: string;
		website?: string;
		industry?: { _id: string; name?: string };
		description?: string;
		logo?: any;
	};
}

export default function CompanyProfileForm({
	initialData,
}: CompanyProfileFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [industries, setIndustries] = useState<Industry[]>([]);
	const [logoPreview, setLogoPreview] = useState<string | null>(
		initialData?.logo?.asset?.url || null,
	);
	const [logoFile, setLogoFile] = useState<File | null>(null);

	const isUpdate = !!initialData;
	const { update } = useSession();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CompanyProfileUpdate>({
		defaultValues: {
			name: initialData?.name,
			website: initialData?.website,
			industry: initialData?.industry?._id || "",
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

				// Ensure the current industry is included
				if (
					initialData?.industry &&
					initialData.industry._id &&
					!result.some(
						(ind) =>
							ind._id ===
							initialData.industry!
								._id,
					)
				) {
					result.push({
						_id: initialData.industry._id,
						name:
							initialData.industry
								.name ??
							"Current Industry",
					});
				}

				setIndustries(result);
			} catch (error) {
				toast.error("Failed to load industries");
			}
		}

		fetchIndustries();
	}, [initialData]);

	// Update form values if initialData changes (e.g., after redirect)
	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name,
				website: initialData.website,
				industry: initialData.industry?._id || "",
				description: initialData.description,
			});
			setLogoPreview(initialData.logo?.asset?.url || null);
		}
	}, [initialData, reset]);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			setLogoPreview(URL.createObjectURL(file));
		}
	};

	const onSubmit = async (data: CompanyProfileUpdate) => {
		setIsSubmitting(true);
		try {
			let logoAsset = null;
			if (logoFile) {
				logoAsset = await uploadImageToSanity(logoFile);
			}

			const companyData = {
				_id: initialData?._id,
				name: data.name,
				website: data.website,
				industry: data.industry,
				description: data.description,
				...(logoAsset && { logo: logoAsset }),
			};

			const endpoint = "/api/company-profile";
			const method = isUpdate ? "PATCH" : "POST";

			const response = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(companyData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				// Handle duplicate company error
				if (
					response.status === 400 &&
					errorData.error ===
						"User already has a company profile."
				) {
					toast.error(
						"You already have a company profile. Redirecting...",
					);
					router.push(
						"/dashboard/company-profile",
					);
					return;
				}
				throw new Error(
					errorData.error ||
						`Failed to ${isUpdate ? "update" : "create"} company profile`,
				);
			}

			const result = await response.json();

			// Update session with new companyId if this is a new company
			if (update && result.companyId) {
				await update();
			}

			if (isUpdate) {
				toast.success("Profile Updated", {
					description:
						"Your company profile has been updated successfully",
				});
			} else {
				toast.success("Company Created", {
					description:
						"Your company profile has been created successfully",
				});
				// Use router.push for client-side navigation with session update
				router.push("/dashboard/company-profile");
				return;
			}
		} catch (error) {
			console.error(
				"Company profile submission error:",
				error,
			);
			toast.error(
				isUpdate ? "Update Failed" : "Creation Failed",
				{
					description:
						error instanceof Error
							? error.message
							: "Please try again later",
				},
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-6 text-sm'>
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
					type='text'
					{...register("website", {
						pattern: {
							value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/,
							message: "Please enter a valid URL",
						},
					})}
					onBlur={(e) => {
						e.target.value = formatURL(
							e.target.value,
						);
					}}
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
					onChange={handleLogoChange}
					className='w-full px-3 py-2 border rounded-md'
				/>
				{logoPreview && (
					<div className='mt-2'>
						<Image
							src={logoPreview}
							alt='Logo Preview'
							width={80}
							height={80}
							className='rounded'
						/>
					</div>
				)}
				{errors.logo && (
					<p className='text-sm text-red-500'>
						{errors.logo.message}
					</p>
				)}
			</div>

			<div className='flex justify-end'>
				<button
					type='submit'
					disabled={isSubmitting}
					className='px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300'>
					{isSubmitting
						? isUpdate
							? "Updating..."
							: "Creating..."
						: isUpdate
							? "Update Profile"
							: "Create Company"}
				</button>
			</div>
		</form>
	);
}
