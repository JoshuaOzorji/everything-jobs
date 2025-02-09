import { defineField, defineType } from "sanity";

export const categoryType = defineType({
	name: "category",
	title: "Category",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Category Name",
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
