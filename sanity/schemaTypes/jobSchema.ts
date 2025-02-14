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
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: async (doc, options) => {
					const client = options.getClient({
						apiVersion: "2025-02-02",
					});

					const [company, jobType] =
						await Promise.all([
							client.fetch(
								`*[_type == "company" && _id == $id][0]`,
								{
									id: (
										doc as unknown as {
											company: {
												_ref: string;
											};
										}
									)
										.company
										._ref,
								},
							),
							client.fetch(
								`*[_type == "jobType" && _id == $id][0]`,
								{
									id: (
										doc as unknown as {
											jobType: {
												_ref: string;
											};
										}
									)
										.jobType
										._ref,
								},
							),
						]);

					return `${doc.title}-${company.name}-${jobType.name}`
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^\w-]+/g, "");
				},
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug) return true;

						const docId =
							context.document?._id ??
							"";
						const existing = await context
							.getClient({
								apiVersion: "2025-02-02",
							})
							.fetch(
								`*[_type == "job" && slug.current == $slug && _id != $id][0]`,
								{
									slug: slug.current,
									id: docId,
								},
							);

						return existing
							? "A job with this slug already exists."
							: true;
					},
				),
		}),

		defineField({
			name: "qualification",
			type: "reference",
			title: "Qualification",
			to: [{ type: "qualification" }],
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
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "deadline",
			type: "datetime",
			title: "Deadline",
			validation: (Rule) =>
				Rule.custom((deadline, context) => {
					if (!deadline) return true; // Allow empty deadline

					const now = new Date().toISOString();
					const publishedAt =
						context.document?.publishedAt;

					if (deadline < now)
						return "Deadline must be in the future";
					if (
						publishedAt &&
						deadline < publishedAt
					)
						return "Deadline must be after the published date";

					return true;
				}),
			options: {
				dateFormat: "DD-MM-YYYY",
				timeFormat: "HH:mm",
				timeStep: 15,
			},
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
			jobType: "jobType.name",
			jobField: "jobField.name",
			media: "mainImage",
		},
		prepare(selection) {
			const { title, company, jobType, jobField } = selection;
			return {
				...selection,
				subtitle: `${company} - ${jobType} - ${jobField}`,
			};
		},
	},
});
