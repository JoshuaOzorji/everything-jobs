import { defineField, defineType } from "sanity";

export const qualificationSchema = defineType({
	name: "qualification",
	title: "Qualification",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
			options: {
				list: [
					{ title: "SSCE", value: "ssce" },
					{
						title: "National Diploma (ND)",
						value: "nd",
					},
					{
						title: "Higher National Diploma (HND)",
						value: "hnd",
					},
					{
						title: "National Certificate of Education (NCE)",
						value: "nce",
					},
					{
						title: "Bachelor's Degree (B.Sc/B.A/B.Ed/B.Eng)",
						value: "bachelors",
					},
					{
						title: "Master's Degree (M.Sc/M.A/M.Ed/M.Eng)",
						value: "masters",
					},
					{
						title: "Doctor of Philosophy (Ph.D)",
						value: "phd",
					},
					{ title: "Others", value: "others" },
				],
			},
		}),

		defineField({
			name: "order",
			title: "Order",
			type: "number",
			hidden: true,
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "level",
		},
	},
});
