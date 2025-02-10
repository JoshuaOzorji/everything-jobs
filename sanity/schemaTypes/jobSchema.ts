import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const jobSchema = defineType({
	name: "job",
	title: "Job",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Job Title",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "company",
			type: "reference",
			title: "Company",
			to: [{ type: "company" }],
			validation: (Rule) => Rule.required(),
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
			name: "salaryRange",
			title: "Salary Range",
			type: "object",
			fields: [
				defineField({
					name: "min",
					title: "Minimum Salary",
					type: "number",
					validation: (Rule) =>
						Rule.required().min(0),
				}),
				defineField({
					name: "max",
					title: "Maximum Salary",
					type: "number",
					validation: (Rule) =>
						Rule.required().min(0),
				}),
			],
		}),
		defineField({
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "deadline",
			type: "datetime",
			title: "Deadline",
			validation: (Rule) =>
				Rule.required()
					.min(new Date().toISOString())
					.error(
						"Deadline must be in the future",
					),
			options: {
				dateFormat: "DD-MM-YYYY",
				timeFormat: "HH:mm",
				timeStep: 15,
			},
		}),
		defineField({
			name: "requirements",
			title: "Requirements",
			type: "array",
			of: [{ type: "string" }],
			validation: (Rule) =>
				Rule.required()
					.min(1)
					.error(
						"Please add at least one requirement",
					),
		}),
		defineField({
			name: "responsibilities",
			title: "Responsibilities",
			type: "array",
			of: [{ type: "string" }],
			// validation: (Rule) =>
			// 	Rule.required()
			// 		.min(1)
			// 		.error(
			// 			"Please add at least one responsibility",
			// 		),
		}),
		defineField({
			name: "recruitmentProcess",
			title: "Recruitment Process",
			type: "array",
			of: [{ type: "string" }],
			validation: (Rule) =>
				Rule.min(1).error(
					"Please describe the recruitment process",
				),
		}),
		defineField({
			name: "mainImage",
			type: "image",
			title: "Main Image",
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
			type: "array",
			title: "Job Description",
			of: [{ type: "block" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "apply",
			type: "array",
			title: "Method of Application",
			of: [{ type: "block" }],
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: "title",
			company: "company.name",
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
