import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import { SanityDocument } from "next-sanity";

export const locationSchema = defineType({
	name: "location",
	title: "Location",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Location Name",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "states",
			type: "array",
			title: "States",
			of: [{ type: "string" }],
			options: {
				list: [
					{ title: "Remote", value: "Remote" },
					{ title: "Abia", value: "Abia" },
					{ title: "Adamawa", value: "Adamawa" },
					{
						title: "Akwa Ibom",
						value: "Akwa-Ibom",
					},
					{ title: "Anambra", value: "Anambra" },
					{ title: "Bauchi", value: "Bauchi" },
					{ title: "Bayelsa", value: "Bayelsa" },
					{ title: "Benue", value: "Benue" },
					{ title: "Borno", value: "Borno" },
					{
						title: "Cross River",
						value: "Cross-River",
					},
					{ title: "Delta", value: "Delta" },
					{ title: "Ebonyi", value: "Ebonyi" },
					{ title: "Edo", value: "Edo" },
					{ title: "Ekiti", value: "Ekiti" },
					{ title: "Enugu", value: "Enugu" },
					{ title: "Abuja", value: "Abuja" },
					{ title: "Gombe", value: "Gombe" },
					{ title: "Imo", value: "Imo" },
					{ title: "Jigawa", value: "Jigawa" },
					{ title: "Kaduna", value: "Kaduna" },
					{ title: "Kano", value: "Kano" },
					{ title: "Katsina", value: "Katsina" },
					{ title: "Kebbi", value: "Kebbi" },
					{ title: "Kogi", value: "Kogi" },
					{ title: "Kwara", value: "Kwara" },
					{ title: "Lagos", value: "Lagos" },
					{
						title: "Nasarawa",
						value: "Nasarawa",
					},
					{ title: "Niger", value: "Niger" },
					{ title: "Ogun", value: "Ogun" },
					{ title: "Ondo", value: "Ondo" },
					{ title: "Osun", value: "Osun" },
					{ title: "Oyo", value: "Oyo" },
					{ title: "Plateau", value: "Plateau" },
					{ title: "Rivers", value: "Rivers" },
					{ title: "Sokoto", value: "Sokoto" },
					{ title: "Taraba", value: "Taraba" },
					{ title: "Yobe", value: "Yobe" },
					{ title: "Zamfara", value: "Zamfara" },
				],
			},
			validation: (Rule) => Rule.required().min(1),
		}),

		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: (doc: SanityDocument) =>
					doc.states?.[0] || "",
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^\w-]+/g, ""),
			},
			validation: (Rule) =>
				Rule.required().custom(
					async (slug, context) => {
						if (!slug || !slug.current)
							return "Slug is required.";

						const doc = context.document as
							| SanityDocument
							| undefined;
						if (!doc || !doc.states?.length)
							return true;

						const docId = doc._id ?? "";
						const stateName = doc.states[0];

						const existing = await context
							.getClient({
								apiVersion: "2023-01-01",
							})
							.fetch(
								`*[_type == "location" && slug.current == $slug && states[0] == $stateName && _id != $id][0]`,
								{
									slug: slug.current,
									stateName,
									id: docId,
								},
							);

						return existing
							? "A location with the same name and slug already exists."
							: true;
					},
				),
		}),
	],
	preview: {
		select: {
			states: "states",
		},
		prepare(selection) {
			const { states } = selection;
			return {
				title: "Location",
				subtitle: states?.join(", "),
			};
		},
	},
});
