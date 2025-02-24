import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const qualificationSchema = defineType({
	name: "qualification",
	title: "Qualification",
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
						if (!name)
							return "Qualification name is required.";

						const { document, getClient } =
							context;
						const client = getClient({
							apiVersion: "2023-01-01",
						});

						const existingQualification =
							await client.fetch(
								`*[_type == "qualification" && name == $name && _id != $id][0]`,
								{
									name,
									id:
										document?._id ||
										"",
								},
							);

						return existingQualification
							? "A qualification with this name already exists."
							: true;
					},
				),
			options: {
				list: [
					{ title: "SSCE", value: "ssce" },
					{
						title: "NCE",
						value: "nce",
					},
					{
						title: "ND",
						value: "nd",
					},
					{
						title: "BSC/BA/HND",
						value: "bsc-ba-hnd",
					},
					{
						title: "MSC/MA/MBA",
						value: "masters",
					},
					{
						title: "PhD/Fellowship",
						value: "phd",
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
						const { document, getClient } =
							context;
						const client = getClient({
							apiVersion: "2023-01-01",
						});
						const existingSlug =
							await client.fetch(
								`*[_type == "qualification" && slug.current == $slug && _id != $id][0]`,
								{
									slug: slug?.current,
									id:
										document?._id ||
										"",
								},
							);

						return existingSlug
							? "A qualification with this slug already exists."
							: true;
					},
				),
		}),
	],
});
