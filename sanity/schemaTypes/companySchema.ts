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
								apiVersion: "2025-02-02",
							});

						// Get the original document to check if name has changed
						const originalDoc =
							await client.fetch(
								`*[_type == "company" && _id == $id][0]`,
								{
									id:
										document?._id ??
										"",
								},
							);

						// Skip validation if name hasn't changed
						if (
							originalDoc &&
							originalDoc.name ===
								name
						) {
							return true;
						}

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
			name: "website",
			type: "url",
			title: "Website",
		}),

		defineField({
			name: "logo",
			type: "image",
			title: "Logo",
			description:
				"If no logo is uploaded, a default logo will be used automatically.",
			options: {
				hotspot: true,
				storeOriginalFilename: true,
			},

			// fields: [
			// 	defineField({
			// 		name: "alt",
			// 		type: "string",
			// 		title: "Alternative Text",
			// 	}),
			// ],
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative Text",
					// Only require alt text if an image exists
					validation: (Rule) =>
						Rule.custom((alt, context) => {
							const image =
								context.parent as {
									asset?: unknown;
								};
							// Only require alt if an image has been uploaded
							if (
								image &&
								image.asset &&
								!alt
							) {
								return "Alt text is required when an image is uploaded";
							}
							return true;
						}),
				}),
			],
		}),

		defineField({
			name: "description",
			type: "text",
			title: "Description",
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
				"Slug will only be generated once. Be sure of the Company name before generating",
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
									`*[_type == "company" && slug.current == $slug && _id != $id][0]`,
									{
										slug: slug.current,
										id: docId,
									},
								);

						// ✅ Fix: Skip validation if the slug hasn't changed
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
	preview: {
		select: {
			title: "name",
			media: "logo",
		},
		prepare({ title, media }) {
			// If no logo is provided, use a default
			return {
				title,
				media: media,
			};
		},
	},
});
