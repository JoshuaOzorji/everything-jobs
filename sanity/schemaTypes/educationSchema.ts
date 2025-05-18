import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const educationSchema = defineType({
	name: "education",
	title: "Education",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Education Level",
			validation: (Rule) =>
				Rule.required().custom(
					async (name, context) => {
						if (!name) return true;

						const existing = await context
							.getClient({
								apiVersion: "2023-01-01",
							})
							.fetch(
								`*[_type == "education" && name == $name && !(_id in [$docId, 'drafts.' + $docId])][0]`,
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
							? "An education level with this name already exists"
							: true;
					},
				),
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
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
				"Slug will only be generated once. Be sure of the Education Level name before generating",
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
									`*[_type == "education" && slug.current == $slug && _id != $id][0]`,
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
