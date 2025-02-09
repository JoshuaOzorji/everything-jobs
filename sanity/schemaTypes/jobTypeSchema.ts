import { defineField, defineType } from "sanity";

export const jobTypeSchema = defineType({
	name: "jobType",
	title: "Job Type",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Job Type Name",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: "name",
		},
	},
});
