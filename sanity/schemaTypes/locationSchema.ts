import { defineField, defineType } from "sanity";

export const locationSchema = defineType({
	name: "location",
	title: "Location",
	type: "document",
	fields: [
		defineField({
			name: "states",
			type: "array",
			title: "States",
			of: [{ type: "string" }],
			options: {
				list: [
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
						value: "Cross River",
					},
					{ title: "Delta", value: "Delta" },
					{ title: "Ebonyi", value: "Ebonyi" },
					{ title: "Edo", value: "Edo" },
					{ title: "Ekiti", value: "Ekiti" },
					{ title: "Enugu", value: "Enugu" },
					{
						title: "Abuja",
						value: "Abuja",
					},
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
	],
	preview: {
		select: {
			states: "states",
		},
		prepare(selection) {
			const { states } = selection;
			return {
				title: "Locations",
				subtitle: states?.join(", "), // Display selected states
			};
		},
	},
});
