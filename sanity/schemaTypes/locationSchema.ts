import { defineField, defineType } from "sanity";

export const locationSchema = defineType({
	name: "location",
	title: "Location",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Location Name",
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
