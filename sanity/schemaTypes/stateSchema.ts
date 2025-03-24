import { defineField, defineType } from "sanity";

export const stateSchema = defineType({
	name: "state",
	title: "State",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "State Name",
			validation: (Rule) =>
				Rule.required().custom(
					async (name, context) => {
						if (!name) return true;

						// Check if another state with the same name exists
						const existing = await context
							.getClient({
								apiVersion: "2023-01-01",
							})
							.fetch(
								`*[_type == "state" && name == $name && !(_id in [$docId, 'drafts.' + $docId])][0]`,
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
							? "A state with this name already exists"
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
				"Slug will only be generated once. Be sure of the State name before generating",
			readOnly: ({ value }) => {
				// Lock slug field if it already has a value
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
									apiVersion: "2025-02-02",
								})
								.fetch(
									`*[_type == "state" && slug.current == $slug && _id != $id][0]`,
									{
										slug: slug.current,
										id: docId,
									},
								);
						// Skip validation if the slug hasn't changed
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
