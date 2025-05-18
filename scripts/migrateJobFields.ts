import { client } from "../sanity/lib/client";
import dotenv from "dotenv";

dotenv.config();

const jobFields = [
	{
		name: "Administration & Office Support",
		slug: "administration-office-support",
	},
	{
		name: "Agriculture, Forestry & Environmental Science",
		slug: "agriculture-forestry-environmental",
	},
	{ name: "Arts, Creative & Design", slug: "arts-creative-design" },
	{ name: "Aviation & Aerospace", slug: "aviation-aerospace" },
	{
		name: "Banking & Financial Services",
		slug: "banking-financial-services",
	},
	{
		name: "Construction & Architecture",
		slug: "construction-architecture",
	},
	{
		name: "Consulting & Professional Services",
		slug: "consulting-professional-services",
	},
	{
		name: "Customer Service & Support",
		slug: "customer-service-support",
	},
	{
		name: "Data Science, Analytics & AI",
		slug: "data-science-analytics-ai",
	},
	{ name: "Education & Training", slug: "education-training" },
	{ name: "Engineering", slug: "engineering" },
	{ name: "Energy, Oil & Gas", slug: "energy-oil-gas" },
	{
		name: "Finance, Accounting & Audit",
		slug: "finance-accounting-audit",
	},
	{
		name: "Healthcare & Medical Services",
		slug: "healthcare-medical-services",
	},
	{
		name: "Hospitality, Tourism & Travel",
		slug: "hospitality-tourism-travel",
	},
	{ name: "Human Resources (HR) & Recruitment", slug: "hr-recruitment" },
	{ name: "Software Development", slug: "software-development" },
	{
		name: "IT Support & Administration",
		slug: "it-support-administration",
	},
	{ name: "Cybersecurity", slug: "cybersecurity" },
	{ name: "Network & Infrastructure", slug: "network-infrastructure" },
	{ name: "Insurance & Actuarial Science", slug: "insurance-actuarial" },
	{ name: "Legal & Compliance", slug: "legal-compliance" },
	{
		name: "Logistics, Supply Chain & Procurement",
		slug: "logistics-supply-chain",
	},
	{
		name: "Manufacturing & Production",
		slug: "manufacturing-production",
	},
	{
		name: "Marketing, Advertising & Media",
		slug: "marketing-advertising-media",
	},
	{
		name: "Non-Profit, Social Services & NGOs",
		slug: "non-profit-social-services",
	},
	{
		name: "Product & Project Management",
		slug: "product-project-management",
	},
	{
		name: "Real Estate & Property Management",
		slug: "real-estate-property",
	},
	{ name: "Retail & E-commerce", slug: "retail-ecommerce" },
	{
		name: "Sales & Business Development",
		slug: "sales-business-development",
	},
	{
		name: "Science, Research & Development",
		slug: "science-research-development",
	},
	{
		name: "Security, Law Enforcement & Intelligence",
		slug: "security-law-enforcement",
	},
	{
		name: "Skilled Trades & Maintenance",
		slug: "skilled-trades-maintenance",
	},
	{ name: "Telecommunications", slug: "telecommunications" },
	{ name: "Transportation & Driving", slug: "transportation-driving" },
];

async function createJobFields() {
	try {
		const existingFields = await client.fetch(
			`count(*[_type == "jobField"])`,
		);

		if (existingFields > 0) {
			console.log(
				`${existingFields} job fields already exist. Skipping creation.`,
			);
			return;
		}

		console.log("No job fields found. Creating job fields...");

		const transaction = client.transaction();

		for (const field of jobFields) {
			transaction.create({
				_type: "jobField",
				name: field.name,
				slug: {
					_type: "slug",
					current: field.slug,
				},
			});
		}

		const result = await transaction.commit();
		console.log(
			`Successfully created ${result.results.length} job fields!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

async function updateJobFields() {
	try {
		const existingFields =
			await client.fetch(`*[_type == "jobField"]{
            _id,
            name,
            slug {
                current
            }
        }`);

		const transaction = client.transaction();

		for (const field of jobFields) {
			const existingField = existingFields.find(
				(f: any) => f.slug.current === field.slug,
			);

			if (existingField) {
				if (existingField.name !== field.name) {
					transaction.patch(existingField._id, {
						set: {
							name: field.name,
							slug: {
								_type: "slug",
								current: field.slug,
							},
						},
					});
					console.log(
						`Updating job field: ${field.name}`,
					);
				}
			} else {
				transaction.create({
					_type: "jobField",
					name: field.name,
					slug: {
						_type: "slug",
						current: field.slug,
					},
				});
				console.log(
					`Creating new job field: ${field.name}`,
				);
			}
		}

		const result = await transaction.commit();
		console.log(
			`Successfully processed ${result.results.length} operations!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

const action = process.argv[2];

if (action === "create") {
	createJobFields();
} else if (action === "update") {
	updateJobFields();
} else {
	console.log("Please specify an action: create or update");
	process.exit(1);
}
