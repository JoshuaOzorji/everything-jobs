import { defineField, defineType } from "sanity";

export const companySchema = defineType({
	name: "company",
	title: "Company",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Company Name",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			options: { source: "name", maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: "website", type: "url", title: "Website" }),
		defineField({
			name: "logo",
			type: "image",
			title: "Logo",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative Text",
				}),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
		}),
	],
	preview: { select: { title: "name", media: "logo" } },
});
