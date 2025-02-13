import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const companySchema = defineType({
	name: "company",
	title: "Company",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Company Name",
			validation: (Rule) =>
				Rule.required().custom(
					async (name, context) => {
						const document =
							context.document as
								| {
										_id?: string;
								  }
								| undefined;
						const client =
							context.getClient({
								apiVersion: "2023-01-01",
							});

						if (!name) return true;

						const existingCompany =
							await client.fetch(
								`*[_type == "company" && name == $name && _id != $id][0]`,
								{
									name,
									id:
										document?._id ??
										"",
								},
							);

						return existingCompany
							? "A company with this name already exists."
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
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^\w-]+/g, ""),
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						const document =
							context.document as
								| {
										_id?: string;
								  }
								| undefined;
						const client =
							context.getClient({
								apiVersion: "2023-01-01",
							});

						if (!slug?.current) return true;

						const existingSlug =
							await client.fetch(
								`*[_type == "company" && slug.current == $slug && _id != $id][0]`,
								{
									slug: slug.current,
									id:
										document?._id ??
										"",
								},
							);

						return existingSlug
							? "A company with this slug already exists."
							: true;
					},
				),
		}),
		defineField({ name: "website", type: "url", title: "Website" }),
		defineField({
			name: "logo",
			type: "image",
			title: "Logo",
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
			type: "text",
			title: "Description",
		}),
	],
	preview: { select: { title: "name", media: "logo" } },
});
