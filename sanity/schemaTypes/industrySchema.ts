import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const industrySchema = defineType({
	name: "industry",
	title: "Industry",
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
								apiVersion: "2025-02-02",
							});

						if (!name) return true;

						// Get the original document to check if name has changed
						const originalDoc =
							await client.fetch(
								`*[_type == "industry" && _id == $id][0]`,
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

						const existingIndustry =
							await client.fetch(
								`*[_type == "industry" && name == $name && _id != $id][0]`,
								{
									name,
									id:
										document?._id ??
										"",
								},
							);

						return existingIndustry
							? "An industry with this name already exists."
							: true;
					},
				),
			options: {
				list: [
					{
						title: "Agriculture & Forestry",
						value: "agriculture-forestry",
					},
					{
						title: "Arts & Entertainment",
						value: "arts-entertainment",
					},
					{
						title: "Automotive",
						value: "automotive",
					},
					{
						title: "Construction",
						value: "construction",
					},
					{
						title: "Education",
						value: "education",
					},
					{
						title: "Energy & Utilities",
						value: "energy-utilities",
					},
					{
						title: "Financial Services",
						value: "financial-services",
					},
					{
						title: "Food & Beverage",
						value: "food-beverage",
					},
					{
						title: "Government",
						value: "government",
					},
					{
						title: "Healthcare",
						value: "healthcare",
					},
					{
						title: "Hospitality & Tourism",
						value: "hospitality-tourism",
					},
					{
						title: "Information Technology",
						value: "information-technology",
					},
					{
						title: "Manufacturing",
						value: "manufacturing",
					},
					{
						title: "Media & Communications",
						value: "media-communications",
					},
					{ title: "Mining", value: "mining" },
					{
						title: "Non-Profit",
						value: "non-profit",
					},
					{
						title: "Professional Services",
						value: "professional-services",
					},
					{
						title: "Real Estate",
						value: "real-estate",
					},
					{
						title: "Retail & E-commerce",
						value: "retail-ecommerce",
					},
					{
						title: "Technology",
						value: "technology",
					},
					{
						title: "Telecommunications",
						value: "telecommunications",
					},
					{
						title: "Transportation & Logistics",
						value: "transportation-logistics",
					},
					{
						title: "Others",
						value: "others",
					},
				],
			},
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
			readOnly: ({ value }) => Boolean(value?.current),
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug?.current) return true;

						const client =
							context.getClient({
								apiVersion: "2025-02-02",
							});
						const docId =
							context.document?._id ??
							"";

						// Get the original document to check if slug has changed
						const originalDoc =
							await client.fetch(
								`*[_type == "industry" && _id == $id][0]`,
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
								`*[_type == "industry" && slug.current == $slug && _id != $id][0]`,
								{
									slug: slug.current,
									id: docId,
								},
							);

						return existing
							? "An industry with this slug already exists."
							: true;
					},
				),
		}),

		defineField({
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: "name",
		},
	},
});
