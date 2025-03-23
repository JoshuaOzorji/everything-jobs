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
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/\s+/g, "-"),
			},
			validation: (Rule) => Rule.required(),
		}),
	],
});
