import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const jobTypeSchema = defineType({
	name: "jobType",
	title: "Job Type",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) =>
				Rule.required().custom(
					async (value, context) => {
						if (!value) return true;
						const docId =
							context.document?._id ||
							"";

						const existing = await context
							.getClient({
								apiVersion: "2025-02-02",
							})
							.fetch(
								`*[_type == "jobType" && name == $name && !_id == $id][0]`,
								{
									name: value,
									id: docId,
								},
							);

						return existing
							? "A job type with this name already exists."
							: true;
					},
				),

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
					{ title: "Others", value: "others" },
				],
			},
		}),

		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^\w-]+/g, ""),
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug) return true;

						const doc = context.document;
						if (!doc) return true;

						const docId = doc._id ?? "";
						const existing = await context
							.getClient({
								apiVersion: "2025-02-02",
							})
							.fetch(
								`*[_type == "jobType" && slug.current == $slug && _id != $id][0]`,
								{
									slug: slug.current,
									id: docId,
								},
							);

						return existing
							? "A job type with this slug already exists."
							: true;
					},
				),
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
		},
	},
});
