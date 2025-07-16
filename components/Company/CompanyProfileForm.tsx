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
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [isEditMode, setIsEditMode] = useState(!initialData); // Auto-edit for new profiles

	const isUpdate = !!initialData;
	const { update } = useSession();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		getValues,
	} = useForm<CompanyProfileUpdate>({
		defaultValues: {
			name: "",
			website: "",
			industry: "",
			description: "",
		},
	});

	// Watch the industry field to debug
	const watchedIndustry = watch("industry");

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
				console.error(
					"Error fetching industries:",
					error,
				);
				toast.error("Failed to load industries");
			}
		}

		fetchIndustries();
	}, []);

	// Set initial form values when data and industries are loaded
	useEffect(() => {
		if (initialData && industries.length > 0 && !isDataLoaded) {
			const industryId = initialData.industry?._id || "";

			// Find the industry in the loaded industries to verify it exists
			const foundIndustry = industries.find(
				(ind) => ind._id === industryId,
			);
			console.log("Found industry in list:", foundIndustry);

			reset({
				name: initialData.name || "",
				website: initialData.website || "",
				industry: industryId,
				description: initialData.description || "",
			});

			// Also set the logo preview
			setLogoPreview(initialData.logo?.asset?.url || null);
			setIsDataLoaded(true);
		}
	}, [initialData, industries, reset, isDataLoaded]);

	// Debug effect to watch form values
	useEffect(() => {}, [watchedIndustry]);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			setLogoPreview(URL.createObjectURL(file));
		}
	};

	const handleEditToggle = () => {
		setIsEditMode(!isEditMode);
		if (isEditMode) {
			// Reset form to original values when canceling edit
			if (initialData && industries.length > 0) {
				reset({
					name: initialData.name || "",
					website: initialData.website || "",
					industry:
						initialData.industry?._id || "",
					description:
						initialData.description || "",
				});
				setLogoPreview(
					initialData.logo?.asset?.url || null,
				);
				setLogoFile(null);
			}
		}
	};

	const onSubmit = async (data: CompanyProfileUpdate) => {
		console.log("Form submission data:", data);
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
				setIsEditMode(false); // Exit edit mode after successful update
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

	const getSelectedIndustryName = () => {
		const selectedIndustry = industries.find(
			(industry) => industry._id === getValues("industry"),
		);
		return selectedIndustry?.name || "Not specified";
	};

	return (
		<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
			{/* Header */}
			<div className='py-2'>
				<div className='flex items-center justify-end'>
					{isUpdate && (
						<button
							onClick={
								handleEditToggle
							}
							className='px-4 py-2 bg-white/20 hover:bg-white/30 text-black rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2'>
							{isEditMode ? (
								<>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={
												2
											}
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
									Cancel
									Edit
								</>
							) : (
								<>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={
												2
											}
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
									Edit
									Profile
								</>
							)}
						</button>
					)}
				</div>
			</div>

			{/* Form Content */}
			<div className='p-6'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-6 text-sm'>
					{/* Company Logo */}
					<div className='flex items-start gap-6'>
						<div className='flex-shrink-0'>
							<div className='w-20 h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden'>
								{logoPreview ? (
									<Image
										src={
											logoPreview
										}
										alt='Company Logo'
										width={
											80
										}
										height={
											80
										}
										className='w-full h-full object-cover rounded-lg'
									/>
								) : (
									<svg
										className='w-8 h-8 text-gray-400'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={
												2
											}
											d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1'
										/>
									</svg>
								)}
							</div>
						</div>
						<div className='flex-1'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Company Logo
							</label>
							{isEditMode ? (
								<input
									type='file'
									accept='image/*'
									onChange={
										handleLogoChange
									}
									className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors'
								/>
							) : (
								<p className='text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2'>
									{logoPreview
										? "Logo uploaded"
										: "No logo uploaded"}
								</p>
							)}
						</div>
					</div>

					{/* Company Name */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium text-gray-700'>
							Company Name *
						</label>
						{isEditMode ? (
							<input
								{...register(
									"name",
									{
										required: "Company name is required",
									},
								)}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
								placeholder='Enter your company name'
							/>
						) : (
							<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900'>
								{getValues(
									"name",
								) ||
									"Not specified"}
							</div>
						)}
						{errors.name && (
							<p className='text-sm text-red-500 flex items-center gap-1'>
								<svg
									className='w-4 h-4'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
										clipRule='evenodd'
									/>
								</svg>
								{
									errors
										.name
										.message
								}
							</p>
						)}
					</div>

					{/* Website */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium text-gray-700'>
							Website
						</label>
						{isEditMode ? (
							<input
								type='text'
								{...register(
									"website",
									{
										pattern: {
											value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/,
											message: "Please enter a valid URL",
										},
									},
								)}
								onBlur={(e) => {
									e.target.value =
										formatURL(
											e
												.target
												.value,
										);
								}}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
								placeholder='https://yourcompany.com'
							/>
						) : (
							<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900'>
								{getValues(
									"website",
								) ? (
									<a
										href={getValues(
											"website",
										)}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-600 hover:text-blue-800 hover:underline'>
										{getValues(
											"website",
										)}
									</a>
								) : (
									"Not specified"
								)}
							</div>
						)}
						{errors.website && (
							<p className='text-sm text-red-500 flex items-center gap-1'>
								<svg
									className='w-4 h-4'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
										clipRule='evenodd'
									/>
								</svg>
								{
									errors
										.website
										.message
								}
							</p>
						)}
					</div>

					{/* Industry */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium text-gray-700'>
							Industry *
						</label>
						{isEditMode ? (
							<select
								{...register(
									"industry",
									{
										required: "Industry is required",
									},
								)}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'>
								<option value=''>
									Select
									Industry
								</option>
								{industries.map(
									(
										industry,
									) => (
										<option
											key={
												industry._id
											}
											value={
												industry._id
											}>
											{
												industry.name
											}
										</option>
									),
								)}
							</select>
						) : (
							<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900'>
								{getSelectedIndustryName()}
							</div>
						)}
						{errors.industry && (
							<p className='text-sm text-red-500 flex items-center gap-1'>
								<svg
									className='w-4 h-4'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
										clipRule='evenodd'
									/>
								</svg>
								{
									errors
										.industry
										.message
								}
							</p>
						)}
					</div>

					{/* Description */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium text-gray-700'>
							Description
						</label>
						{isEditMode ? (
							<textarea
								{...register(
									"description",
								)}
								rows={4}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none'
								placeholder='Tell us about your company...'
							/>
						) : (
							<div className='w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 min-h-[100px]'>
								{getValues(
									"description",
								) ||
									"No description provided"}
							</div>
						)}
					</div>

					{/* Submit Button - Only show when in edit mode */}
					{isEditMode && (
						<div className='flex justify-end pt-4 border-t border-gray-200'>
							<button
								type='submit'
								disabled={
									isSubmitting
								}
								className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center gap-2'>
								{isSubmitting ? (
									<>
										<svg
											className='w-4 h-4 animate-spin'
											fill='none'
											viewBox='0 0 24 24'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
										</svg>
										{isUpdate
											? "Updating..."
											: "Creating..."}
									</>
								) : (
									<>
										<svg
											className='w-4 h-4'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={
													2
												}
												d='M5 13l4 4L19 7'
											/>
										</svg>
										{isUpdate
											? "Update Profile"
											: "Create Company"}
									</>
								)}
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
