"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
	CompanyProfileUpdate,
	Industry,
	CompanyProfileData,
} from "@/types/types";
import { uploadImageToSanity } from "@/lib/uploadImageToSanity";
import { client } from "@/sanity/lib/client";
import {
	useCreateCompany,
	useUpdateCompany,
} from "@/hooks/useCompanyMutations";
import { CompanyProfileHeader } from "./CompanyProfileHeader";
import { CompanyLogoUpload } from "./CompanyLogoUpload";
import { CompanyNameField } from "./CompanyNameField";
import { WebsiteField } from "./WebsiteField";
import { IndustryField } from "./IndustryField";
import { DescriptionField } from "./DescriptionField";
import { SubmitButton } from "./SubmitButton";

// Fetch industries function
const fetchIndustries = async (): Promise<Industry[]> => {
	const result = await client.fetch<Industry[]>(`
		*[_type == "industry"] {
			_id,
			name
		} | order(name asc)
	`);
	return result;
};

// Custom hook for company profile logic - now optimized with TanStack Query
function useCompanyProfile(initialData?: CompanyProfileData) {
	const [logoPreview, setLogoPreview] = useState<string | null>(
		initialData?.logo?.asset?.url || null,
	);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [isEditMode, setIsEditMode] = useState(!initialData);

	const isUpdate = !!initialData;
	const { update } = useSession();
	const router = useRouter();

	// Use TanStack Query for industries - eliminates useEffect
	const {
		data: industries = [],
		isLoading: industriesLoading,
		error: industriesError,
	} = useQuery<Industry[], Error>({
		queryKey: ["industries"],
		queryFn: fetchIndustries,
		staleTime: 10 * 60 * 1000, // Industries don't change often, cache for 10 minutes
		gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes (replaces cacheTime)
	});

	// Get mutation hooks
	const createCompany = useCreateCompany();
	const updateCompany = useUpdateCompany();

	const form = useForm<CompanyProfileUpdate>({
		defaultValues: {
			name: initialData?.name || "",
			website: initialData?.website || "",
			industry: initialData?.industry?._id || "",
			description: initialData?.description || "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		getValues,
	} = form;

	// Show error toast if industries fail to load
	if (industriesError) {
		toast.error("Failed to load industries");
	}

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			setLogoPreview(URL.createObjectURL(file));
		}
	};

	const handleEditToggle = () => {
		setIsEditMode(!isEditMode);
		if (isEditMode && initialData) {
			// Reset form to original values
			reset({
				name: initialData.name || "",
				website: initialData.website || "",
				industry: initialData.industry?._id || "",
				description: initialData.description || "",
			});
			setLogoPreview(initialData.logo?.asset?.url || null);
			setLogoFile(null);
		}
	};

	const getSelectedIndustryName = () => {
		const selectedIndustry = industries.find(
			(industry: Industry) =>
				industry._id === getValues("industry"),
		);
		return selectedIndustry?.name || "Not specified";
	};

	const onSubmit = async (data: CompanyProfileUpdate) => {
		try {
			let logoAsset = null;
			if (logoFile) {
				logoAsset = await uploadImageToSanity(logoFile);
			}

			const companyData = {
				name: data.name,
				website: data.website,
				industry: data.industry,
				description: data.description,
				...(logoAsset && { logo: logoAsset }),
				...(initialData?._id && {
					_id: initialData._id,
				}), // Only include _id for updates
			};

			if (isUpdate) {
				// Use the update mutation - ensure we have an _id
				if (!initialData?._id) {
					throw new Error(
						"Company ID is required for updates",
					);
				}

				await updateCompany.mutateAsync({
					...companyData,
					_id: initialData._id,
				});

				toast.success("Profile Updated", {
					description:
						"Your company profile has been updated successfully",
				});
				setIsEditMode(false);
			} else {
				// Use the create mutation - don't include _id
				const createData = {
					name: data.name,
					website: data.website,
					industry: data.industry,
					description: data.description,
					...(logoAsset && { logo: logoAsset }),
				};

				await createCompany.mutateAsync(createData);

				// Update session if needed
				if (update) {
					await update();
				}

				toast.success("Company Created", {
					description:
						"Your company profile has been created successfully",
				});
				router.push("/dashboard/company-profile");
			}
		} catch (error) {
			console.error(
				"Company profile submission error:",
				error,
			);

			// Handle specific error cases
			if (
				error instanceof Error &&
				error.message.includes("already has a company")
			) {
				toast.error(
					"You already have a company profile. Redirecting...",
				);
				router.push("/dashboard/company-profile");
				return;
			}

			toast.error(
				isUpdate ? "Update Failed" : "Creation Failed",
				{
					description:
						error instanceof Error
							? error.message
							: "Please try again later",
				},
			);
		}
	};

	return {
		register,
		handleSubmit,
		errors,
		getValues,
		isSubmitting:
			createCompany.isPending || updateCompany.isPending,
		industries,
		industriesLoading,
		logoPreview,
		isEditMode,
		isUpdate,
		handleLogoChange,
		handleEditToggle,
		getSelectedIndustryName,
		onSubmit,
	};
}

// Component interface
interface CompanyProfileFormProps {
	initialData?: CompanyProfileData;
}

// Main component
export default function CompanyProfileForm({
	initialData,
}: CompanyProfileFormProps) {
	const {
		register,
		handleSubmit,
		errors,
		getValues,
		isSubmitting,
		industries,
		industriesLoading,
		logoPreview,
		isEditMode,
		isUpdate,
		handleLogoChange,
		handleEditToggle,
		getSelectedIndustryName,
		onSubmit,
	} = useCompanyProfile(initialData);

	// Show loading state while industries are loading
	if (industriesLoading) {
		return (
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6'>
					<div className='animate-pulse'>
						<div className='h-4 bg-gray-200 rounded w-1/4 mb-4'></div>
						<div className='h-10 bg-gray-200 rounded mb-4'></div>
						<div className='h-4 bg-gray-200 rounded w-1/3 mb-4'></div>
						<div className='h-10 bg-gray-200 rounded mb-4'></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
			<CompanyProfileHeader
				isUpdate={isUpdate}
				isEditMode={isEditMode}
				onEditToggle={handleEditToggle}
			/>

			<div className='p-6'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-6 text-sm'>
					<CompanyLogoUpload
						logoPreview={logoPreview}
						isEditMode={isEditMode}
						onLogoChange={handleLogoChange}
					/>

					<CompanyNameField
						register={register}
						errors={errors}
						isEditMode={isEditMode}
						currentValue={getValues("name")}
					/>

					<WebsiteField
						register={register}
						errors={errors}
						isEditMode={isEditMode}
						currentValue={getValues(
							"website",
						)}
					/>

					<IndustryField
						register={register}
						errors={errors}
						isEditMode={isEditMode}
						industries={industries}
						currentValue={getValues(
							"industry",
						)}
						selectedIndustryName={getSelectedIndustryName()}
					/>

					<DescriptionField
						register={register}
						errors={errors}
						isEditMode={isEditMode}
						currentValue={getValues(
							"description",
						)}
					/>

					<SubmitButton
						isSubmitting={isSubmitting}
						isUpdate={isUpdate}
						isEditMode={isEditMode}
					/>
				</form>
			</div>
		</div>
	);
}
