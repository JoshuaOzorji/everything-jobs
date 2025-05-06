import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const pendingJobSchema = defineType({
	name: "pendingJob",
	title: "Pending Job",
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
			name: "summary",
			type: "array",
			title: "Job Summary Details",
			of: [{ type: "block" }],
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
			to: [{ type: "state" }],
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
			name: "education",
			type: "reference",
			title: "Education",
			to: [{ type: "education" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "jobField",
			type: "reference",
			title: "Job Field",
			to: [{ type: "jobField" }],
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
			validation: (Rule) =>
				Rule.custom((range) => {
					if (
						!range ||
						range.min == null ||
						range.max == null
					)
						return true;

					return range.max < range.min
						? "Maximum salary must be greater than or equal to the minimum salary"
						: true;
				}),
		}),
		defineField({
			name: "level",
			title: "Experience Level",
			type: "reference",
			to: [{ type: "jobLevel" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "experienceRange",
			title: "Experience Range (Years)",
			type: "object",
			fields: [
				defineField({
					name: "min",
					title: "Minimum Years",
					type: "number",
					validation: (Rule) =>
						Rule.required()
							.min(0)
							.error(
								"Minimum years must be 0 or greater",
							),
				}),
				defineField({
					name: "max",
					title: "Maximum Years",
					type: "number",
					validation: (Rule) =>
						Rule.required()
							.min(0)
							.error(
								"Maximum years must be 0 or greater",
							),
				}),
			],
			validation: (Rule) =>
				Rule.custom((range) => {
					if (
						!range ||
						range.min == null ||
						range.max == null
					)
						return true;

					return range.max < range.min
						? "Maximum years must be greater than or equal to minimum years"
						: true;
				}),
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
			name: "apply",
			type: "array",
			title: "Method of Application",
			of: [{ type: "block" }],
			validation: (Rule) => Rule.required(),
		}),
		// Additional fields specific to pending jobs
		defineField({
			name: "submittedAt",
			type: "datetime",
			title: "Submitted At",
			readOnly: true,
		}),
		defineField({
			name: "status",
			type: "string",
			title: "Status",
			options: {
				list: [
					{ title: "Pending", value: "pending" },
					{
						title: "Approved",
						value: "approved",
					},
					{
						title: "Rejected",
						value: "rejected",
					},
				],
			},
			initialValue: "pending",
		}),
		defineField({
			name: "submitterEmail",
			type: "string",
			title: "Submitter Email",
			validation: (Rule) => Rule.required().email(),
		}),
		defineField({
			name: "submitterName",
			type: "string",
			title: "Submitter Name",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "adminNotes",
			type: "text",
			title: "Admin Notes",
			description: "Private notes for admin review",
		}),
	],
	preview: {
		select: {
			title: "title",
			company: "company.name",
			jobType: "jobType.name",
			status: "status",
		},
		prepare(selection) {
			const { title, company, jobType, status } = selection;
			return {
				title,
				subtitle: `${company || "Unknown Company"} - ${jobType || "Unknown Type"} [${status || "pending"}]`,
			};
		},
	},
});
