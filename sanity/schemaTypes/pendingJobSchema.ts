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
		defineField({
			name: "companyName",
			type: "string",
			title: "Company Name",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "summary",
			type: "array",
			title: "Job Summary Details",
			of: [
				{
					type: "block",
					// Add styles and formatting options
					styles: [
						{
							title: "Normal",
							value: "normal",
						},
						{
							title: "Heading",
							value: "h4",
						},
					],
					// Limit marks to basic formatting
					marks: {
						decorators: [
							{
								title: "Strong",
								value: "strong",
							},
							{
								title: "Emphasis",
								value: "em",
							},
						],
					},
				},
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "locationName",
			type: "string",
			title: "Location",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "jobTypeName",
			type: "string",
			title: "Job Type",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "educationLevel",
			type: "string",
			title: "Education",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "jobFieldName",
			type: "string",
			title: "Job Field",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "experienceLevel",
			type: "string",
			title: "Experience Level",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "deadline",
			type: "datetime",
			title: "Deadline",
			validation: (Rule) =>
				Rule.custom((deadline) => {
					if (!deadline) return true; // Allow empty deadline
					const now = new Date().toISOString();
					if (deadline < now)
						return "Deadline must be in the future";
					return true;
				}),
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
			name: "experienceRange",
			title: "Experience Range (Years)",
			type: "object",
			fields: [
				defineField({
					name: "min",
					title: "Minimum Years",
					type: "number",
					validation: (Rule) =>
						Rule.required().min(0),
				}),
				defineField({
					name: "max",
					title: "Maximum Years",
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
						? "Maximum years must be greater than or equal to minimum years"
						: true;
				}),
		}),
		defineField({
			name: "requirements",
			title: "Requirements",
			type: "array",
			of: [
				{
					type: "string",
					validation: (Rule) =>
						Rule.custom((text) => {
							if (!text) return true;
							if (
								typeof text !==
								"string"
							)
								return true;
							return true;
						}),
				},
			],
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
			of: [
				{
					type: "string",
					validation: (Rule) =>
						Rule.custom((text) => {
							if (!text) return true;
							if (
								typeof text !==
								"string"
							)
								return true;
							return true;
						}),
				},
			],
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
			of: [
				{
					type: "block",
					styles: [
						{
							title: "Normal",
							value: "normal",
						},
					],
					marks: {
						decorators: [
							{
								title: "Strong",
								value: "strong",
							},
							{
								title: "Emphasis",
								value: "em",
							},
						],
					},
				},
			],
			validation: (Rule) => Rule.required(),
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
			name: "rejectionReason",
			type: "text",
			title: "Rejection Reason",
			hidden: ({ document }) =>
				document?.status !== "rejected",
			validation: (Rule) =>
				Rule.custom((reason, context) => {
					if (
						context.document?.status ===
							"rejected" &&
						!reason
					) {
						return "Please provide a reason for rejection";
					}
					return true;
				}),
		}),
		defineField({
			name: "submitterInfo",
			title: "Submitter Information",
			type: "object",
			fields: [
				defineField({
					name: "name",
					type: "string",
					title: "Name",
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: "email",
					type: "string",
					title: "Email",
					validation: (Rule) =>
						Rule.required().email(),
				}),
				defineField({
					name: "phoneNumber",
					type: "string",
					title: "Phone Number",
				}),
			],
		}),
		defineField({
			name: "adminNotes",
			type: "text",
			title: "Admin Notes",
			description: "Private notes for admin review",
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
			companyName: "companyName",
			status: "status",
			email: "submitterInfo.email",
		},
		prepare({ title, companyName, status, email }) {
			return {
				title: `${title} - ${companyName || "Reputable Company"}`,
				subtitle: `Status: ${status} | Submitted by: ${email}`,
			};
		},
	},
});
