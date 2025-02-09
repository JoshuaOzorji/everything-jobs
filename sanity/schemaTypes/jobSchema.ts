import { defineField, defineType } from "sanity";

export const jobType = defineType({
	name: "job",
	title: "Job",
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Job Title",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			options: {
				source: "title",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "company",
			type: "string",
			title: "Company Name",
		}),
		defineField({
			name: "location",
			type: "reference",
			title: "Location",
			to: [{ type: "location" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "jobType",
			type: "reference",
			title: "Job Type",
			to: [{ type: "jobType" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "qualification",
			type: "reference",
			title: "Qualification",
			to: [{ type: "qualification" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "category",
			type: "reference",
			title: "Category",
			to: [{ type: "category" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Job Description",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "mainImage",
			type: "image",
			title: "Main Image",
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative Text",
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			company: "company",
			location: "location.name",
			media: "mainImage",
		},
		prepare(selection) {
			const { title, company, location } = selection;
			return {
				...selection,
				subtitle: `${company} - ${location}`,
			};
		},
	},
});
