import { defineField, defineType } from "sanity";

export const citySchema = defineType({
	name: "city",
	title: "City",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "City Name",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "state",
			type: "reference",
			to: [{ type: "state" }],
			title: "State",
			validation: (Rule) => Rule.required(),
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
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug || !slug.current)
							return "Slug is required";

						const doc = context.document;
						if (
							!doc ||
							!doc.state ||
							!(
								doc.state as {
									_ref: string;
								}
							)._ref
						)
							return true;

						// Check for city with same name in same state
						const existing = await context
							.getClient({
								apiVersion: "2023-01-01",
							})
							.fetch(
								`*[_type == "city" && 
                  slug.current == $slug && 
                  state._ref == $stateId && 
                  !(_id in [$docId, 'drafts.' + $docId])][0]`,
								{
									slug: slug.current,
									stateId: (
										doc.state as {
											_ref: string;
										}
									)._ref,
									docId: doc._id.replace(
										/^drafts\./,
										"",
									),
								},
							);

						return existing
							? "A city with this name already exists in this state"
							: true;
					},
				),
		}),
		// Optional additional fields
		defineField({
			name: "isCapital",
			type: "boolean",
			title: "Is State Capital",
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: "name",
			stateName: "state.name",
		},
		prepare({ title, stateName }) {
			return {
				title,
				subtitle: stateName ? `${stateName} State` : "",
			};
		},
	},
});
