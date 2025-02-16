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
			name: "publishedAt",
			type: "datetime",
			title: "Published At",
			validation: (Rule) => Rule.required(),
			readOnly: ({ document }) =>
				Boolean(document?.publishedAt),
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
				maxLength: 200,
			},
			description:
				"This field will become read-only after the company is published",
			readOnly: ({ document }) => {
				return Boolean(document?.publishedAt);
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						const documentIsPublished =
							Boolean(
								context.document
									?.publishedAt,
							);

						// If document is not published and slug is empty, that's okay
						if (
							!documentIsPublished &&
							!slug?.current
						)
							return true;

						// If document is published, require a slug
						if (
							documentIsPublished &&
							!slug?.current
						) {
							return "Published documents must have a slug";
						}

						// Check for duplicate slugs
						if (slug?.current) {
							const existing =
								await context
									.getClient(
										{
											apiVersion: "2025-02-02",
										},
									)
									.fetch(
										`*[_type == "company" && slug.current == $slug && _id != $id][0]`,
										{
											slug: slug.current,
											id:
												context
													.document
													?._id ??
												"",
										},
									);

							return existing
								? "A company with this slug already exists."
								: true;
						}

						return true;
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
