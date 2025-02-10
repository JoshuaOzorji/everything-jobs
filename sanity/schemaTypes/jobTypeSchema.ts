import { defineField, defineType } from "sanity";

export const jobTypeSchema = defineType({
	name: "jobType",
	title: "Job Type",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
			options: {
				list: [
					{
						title: "Full-time",
						value: "full-time",
					},
					{
						title: "Part-time",
						value: "part-time",
					},
					{
						title: "Contract",
						value: "contract",
					},
					{
						title: "Temporary",
						value: "temporary",
					},
					{
						title: "Internship",
						value: "internship",
					},
					{
						title: "Apprenticeship",
						value: "apprenticeship",
					},
					{
						title: "Freelance",
						value: "freelance",
					},
					{ title: "Remote", value: "remote" },
					{ title: "Hybrid", value: "hybrid" },
					{ title: "On-site", value: "on-site" },
					{
						title: "Volunteer",
						value: "volunteer",
					},
					{
						title: "Per Diem",
						value: "per-diem",
					},
					{
						title: "Seasonal",
						value: "seasonal",
					},
					{
						title: "Others",
						value: "others",
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
	],
	preview: {
		select: {
			title: "name",
			subtitle: "description",
		},
	},
});
