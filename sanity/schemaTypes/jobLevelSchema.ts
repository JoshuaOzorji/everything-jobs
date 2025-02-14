import { defineType, defineField } from "sanity";

export const jobLevelSchema = defineType({
	name: "jobLevel",
	title: "Job Level",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) =>
				Rule.required().custom(
					async (name, context) => {
						if (!name) return true; // Skip validation if empty

						const { document, getClient } =
							context;
						const client = getClient({
							apiVersion: "2023-01-01",
						});

						const existing =
							await client.fetch(
								`*[_type == "jobLevel" && name == $name && _id != $id][0]`,
								{
									name,
									id: document?._id,
								},
							);

						return existing
							? "A job level with this name already exists."
							: true;
					},
				),
			options: {
				list: [
					{
						title: "Entry Level",
						value: "entry-level",
					},
					{
						title: "Mid Level",
						value: "mid-level",
					},
					{
						title: "Senior Level",
						value: "senior-level",
					},
					{
						title: "Director",
						value: "director",
					},
					{
						title: "Executive",
						value: "executive",
					},
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
				Rule.custom(async (slug, context) => {
					if (!slug) return true; // Skip validation if empty

					const { document, getClient } = context;
					const client = getClient({
						apiVersion: "2023-01-01",
					});

					const existing = await client.fetch(
						`*[_type == "jobLevel" && slug.current == $slug && _id != $id][0]`,
						{
							slug: slug.current,
							id: document?._id,
						},
					);

					return existing
						? "A job level with this slug already exists."
						: true;
				}),
		}),
	],
});
