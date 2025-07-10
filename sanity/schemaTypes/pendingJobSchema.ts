import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const pendingJobSchema = defineType({
	name: "pendingJob",
	title: "Pending Jobs",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Job Title",
			validation: (Rule) => Rule.required(),
		}),
		// Replace companyName with company reference
		defineField({
			name: "company",
			type: "reference",
			title: "Company",
			to: [{ type: "company" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "summary",
			type: "array",
			title: "Job Summary Details",
			of: [{ type: "block" }],
		}),
		// Replace string fields with references
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
			name: "level",
			type: "reference",
			title: "Experience Level",
			to: [{ type: "jobLevel" }],
			validation: (Rule) => Rule.required(),
		}),
		// Keep existing fields
		defineField({
			name: "deadline",
			type: "datetime",
			title: "Deadline",
			validation: (Rule) =>
				Rule.custom((deadline) => {
					if (!deadline) return true;
					const now = new Date().toISOString();
					if (deadline < now)
						return "Deadline must be in the future";
					return true;
				}),
		}),
		// Keep existing salary and experience range fields
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
						? "Maximum salary must be greater than or equal to minimum salary"
						: true;
				}),
		}),
		// Keep existing fields for requirements, responsibilities, etc.
		defineField({
			name: "requirements",
			title: "Requirements",
			type: "array",
			of: [{ type: "string" }],
			validation: (Rule) => Rule.required().min(1),
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
		}),
		defineField({
			name: "apply",
			type: "array",
			title: "Method of Application",
			of: [{ type: "block" }],
			validation: (Rule) => Rule.required(),
		}),
		// Status tracking with timestamps
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
			name: "statusUpdatedAt",
			type: "datetime",
			title: "Status Updated At",
			readOnly: true,
		}),
		// Replace submitterInfo with userId reference
		defineField({
			name: "userId",
			type: "string",
			title: "Submitter ID",
			description: "MongoDB User ID of the submitter",
			validation: (Rule) => Rule.required(),
			readOnly: true,
		}),
		defineField({
			name: "submittedAt",
			type: "datetime",
			title: "Submitted At",
			readOnly: true,
		}),
	],
	preview: {
		select: {
			title: "title",
			company: "company.name",
			status: "status",
		},
		prepare({ title, company, status }) {
			return {
				title: `${title} - ${company || "Unknown Company"}`,
				subtitle: `Status: ${status}`,
			};
		},
	},
});
