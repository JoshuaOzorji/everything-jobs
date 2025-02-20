import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const jobFieldSchema = defineType({
	name: "jobField",
	title: "Job Field",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) =>
				Rule.required().custom(
					async (name, context) => {
						const document =
							context.document as
								| {
										_id?: string;
								  }
								| undefined;
						const client =
							context.getClient({
								apiVersion: "2023-01-01",
							});

						if (!name) return true;

						// Get the original document to check if name has changed
						const originalDoc =
							await client.fetch(
								`*[_type == "jobField" && _id == $id][0]`,
								{
									id:
										document?._id ??
										"",
								},
							);

						// Skip validation if name hasn't changed
						if (
							originalDoc &&
							originalDoc.name ===
								name
						) {
							return true;
						}

						const existingJobField =
							await client.fetch(
								`*[_type == "jobField" && name == $name && _id != $id][0]`,
								{
									name,
									id:
										document?._id ??
										"",
								},
							);

						return existingJobField
							? "A job field with this name already exists."
							: true;
					},
				),
			options: {
				list: [
					{
						title: "Administration & Office Support",
						value: "administration-office-support",
					},
					{
						title: "Agriculture, Forestry & Environmental Science",
						value: "agriculture-forestry-environmental",
					},
					{
						title: "Arts, Creative & Design",
						value: "arts-creative-design",
					},
					{
						title: "Aviation & Aerospace",
						value: "aviation-aerospace",
					},
					{
						title: "Banking & Financial Services",
						value: "banking-financial-services",
					},
					{
						title: "Construction & Architecture",
						value: "construction-architecture",
					},
					{
						title: "Consulting & Professional Services",
						value: "consulting-professional-services",
					},
					{
						title: "Customer Service & Support",
						value: "customer-service-support",
					},
					{
						title: "Data Science, Analytics & AI",
						value: "data-science-analytics-ai",
					},
					{
						title: "Education & Training",
						value: "education-training",
					},
					{
						title: "Engineering",
						value: "engineering",
					},
					{
						title: "Energy, Oil & Gas",
						value: "energy-oil-gas",
					},
					{
						title: "Finance, Accounting & Audit",
						value: "finance-accounting-audit",
					},
					{
						title: "Healthcare & Medical Services",
						value: "healthcare-medical-services",
					},
					{
						title: "Hospitality, Tourism & Travel",
						value: "hospitality-tourism-travel",
					},
					{
						title: "Human Resources (HR) & Recruitment",
						value: "hr-recruitment",
					},
					{
						title: "Software Development",
						value: "software-development",
					},
					{
						title: "IT Support & Administration",
						value: "it-support-administration",
					},
					{
						title: "Cybersecurity",
						value: "cybersecurity",
					},
					{
						title: "Network & Infrastructure",
						value: "network-infrastructure",
					},
					{
						title: "Insurance & Actuarial Science",
						value: "insurance-actuarial",
					},
					{
						title: "Legal & Compliance",
						value: "legal-compliance",
					},
					{
						title: "Logistics, Supply Chain & Procurement",
						value: "logistics-supply-chain",
					},
					{
						title: "Manufacturing & Production",
						value: "manufacturing-production",
					},
					{
						title: "Marketing, Advertising & Media",
						value: "marketing-advertising-media",
					},
					{
						title: "Non-Profit, Social Services & NGOs",
						value: "non-profit-social-services",
					},
					{
						title: "Product & Project Management",
						value: "product-project-management",
					},
					{
						title: "Real Estate & Property Management",
						value: "real-estate-property",
					},
					{
						title: "Retail & E-commerce",
						value: "retail-ecommerce",
					},
					{
						title: "Sales & Business Development",
						value: "sales-business-development",
					},
					{
						title: "Science, Research & Development",
						value: "science-research-development",
					},
					{
						title: "Security, Law Enforcement & Intelligence",
						value: "security-law-enforcement",
					},
					{
						title: "Skilled Trades & Maintenance",
						value: "skilled-trades-maintenance",
					},
					{
						title: "Telecommunications",
						value: "telecommunications",
					},
					{
						title: "Transportation & Driving",
						value: "transportation-driving",
					},
				],
			},
		}),
		defineField({
			name: "order",
			title: "Order",
			type: "number",
			hidden: true,
		}),

		defineField({
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			validation: (Rule) => Rule.required(),
		}),

		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^\w-]+/g, ""),
			},
			description:
				"This field will become read-only once a value is set.",
			readOnly: ({ value }) => {
				// Lock slug field if it already has a value
				return Boolean(value?.current);
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug?.current) return true;

						const client =
							context.getClient({
								apiVersion: "2023-01-01",
							});
						const docId =
							context.document?._id ??
							"";

						// Get the original document to check if slug has changed
						const originalDoc =
							await client.fetch(
								`*[_type == "jobField" && _id == $id][0]`,
								{ id: docId },
							);

						// If the document exists and the slug hasn't changed, skip validation
						if (
							originalDoc &&
							originalDoc.slug
								?.current ===
								slug.current
						) {
							return true;
						}

						const existing =
							await client.fetch(
								`*[_type == "jobField" && slug.current == $slug && _id != $id][0]`,
								{
									slug: slug.current,
									id: docId,
								},
							);

						return existing
							? "A job field with this slug already exists."
							: true;
					},
				),
		}),
	],
	preview: {
		select: {
			title: "name",
		},
	},
});
