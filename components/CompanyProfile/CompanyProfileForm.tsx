"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	CompanyProfileUpdate,
	Industry,
	CompanyProfileData,
} from "@/types/types";
import { uploadImageToSanity } from "@/lib/uploadImageToSanity";
import { client } from "@/sanity/lib/client";
import { CompanyProfileHeader } from "./CompanyProfileHeader";
import { CompanyLogoUpload } from "./CompanyLogoUpload";
import { CompanyNameField } from "./CompanyNameField";
import { WebsiteField } from "./WebsiteField";
import { IndustryField } from "./IndustryField";
import { DescriptionField } from "./DescriptionField";
import { SubmitButton } from "./SubmitButton";

// Custom hook for company profile logic
function useCompanyProfile(initialData?: CompanyProfileData) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [industries, setIndustries] = useState<Industry[]>([]);
	const [logoPreview, setLogoPreview] = useState<string | null>(
		initialData?.logo?.asset?.url || null,
	);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [isEditMode, setIsEditMode] = useState(!initialData);

	const isUpdate = !!initialData;
	const { update } = useSession();
	const router = useRouter();

	const form = useForm<CompanyProfileUpdate>({
		defaultValues: {
			name: "",
			website: "",
			industry: "",
			description: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		getValues,
	} = form;

	// Fetch industries
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

	// Set initial form values
	useEffect(() => {
		if (initialData && industries.length > 0 && !isDataLoaded) {
			const industryId = initialData.industry?._id || "";
			reset({
				name: initialData.name || "",
				website: initialData.website || "",
				industry: industryId,
				description: initialData.description || "",
			});
			setLogoPreview(initialData.logo?.asset?.url || null);
			setIsDataLoaded(true);
		}
	}, [initialData, industries, reset, isDataLoaded]);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			setLogoPreview(URL.createObjectURL(file));
		}
	};

	const handleEditToggle = () => {
		setIsEditMode(!isEditMode);
		if (isEditMode && initialData && industries.length > 0) {
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
			(industry) => industry._id === getValues("industry"),
		);
		return selectedIndustry?.name || "Not specified";
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

			if (update && result.companyId) {
				await update();
			}

			if (isUpdate) {
				toast.success("Profile Updated", {
					description:
						"Your company profile has been updated successfully",
				});
				setIsEditMode(false);
			} else {
				toast.success("Company Created", {
					description:
						"Your company profile has been created successfully",
				});
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

	return {
		register,
		handleSubmit,
		errors,
		getValues,
		isSubmitting,
		industries,
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
		logoPreview,
		isEditMode,
		isUpdate,
		handleLogoChange,
		handleEditToggle,
		getSelectedIndustryName,
		onSubmit,
	} = useCompanyProfile(initialData);

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
