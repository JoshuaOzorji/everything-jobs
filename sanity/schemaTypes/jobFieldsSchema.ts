import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const jobFieldSchema = defineType({
	name: "jobField",
	title: "Job Field",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) =>
				Rule.required().custom(
					async (name, context) => {
						if (!name) return true;

						const existing = await context
							.getClient({
								apiVersion: "2023-01-01",
							})
							.fetch(
								`*[_type == "jobField" && name == $name && !(_id in [$docId, 'drafts.' + $docId])][0]`,
								{
									name,
									docId: context.document
										? context.document._id.replace(
												/^drafts\./,
												"",
											)
										: "",
								},
							);

						return existing
							? "A job field with this name already exists"
							: true;
					},
				),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^\w-]+/g, ""),
			},
			description:
				"Slug will only be generated once. Be sure of the Job Field name before generating",
			readOnly: ({ value }) => {
				return Boolean(value?.current);
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug?.current)
							return "Slug is required.";

						const doc = context.document;
						if (!doc) return true;

						const docId = doc._id ?? "";
						const existingSlug =
							await context
								.getClient({
									apiVersion: "2023-01-01",
								})
								.fetch(
									`*[_type == "jobField" && slug.current == $slug && _id != $id][0]`,
									{
										slug: slug.current,
										id: docId,
									},
								);

						if (
							existingSlug &&
							existingSlug.slug
								.current ===
								slug.current
						) {
							return true;
						}

						return existingSlug
							? "This slug is already in use."
							: true;
					},
				),
		}),
	],
});
