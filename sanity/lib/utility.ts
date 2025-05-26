interface EducationMap {
	[key: string]: string;
}

export const getDisplayNameForEducation = (value: string): string => {
	const educationMap: EducationMap = {
		ssce: "SSCE",
		nce: "NCE",
		nd: "ND",
		"bsc-ba-hnd": "BSC/BA/HND",
		masters: "MSC/MA/MBA",
		phd: "PhD/Fellowship",
		others: "Others",
	};

	return educationMap[value] || value;
};

interface JobFieldMap {
	[key: string]: string;
}

export const getDisplayNameForJobField = (value: string): string => {
	const jobFieldMap: JobFieldMap = {
		"administration-office-support":
			"Administration & Office Support",
		"agriculture-forestry-environmental":
			"Agriculture, Forestry & Environmental Science",
		"arts-creative-design": "Arts, Creative & Design",
		"aviation-aerospace": "Aviation & Aerospace",
		"banking-financial-services": "Banking & Financial Services",
		"construction-architecture": "Construction & Architecture",
		"consulting-professional-services":
			"Consulting & Professional Services",
		"customer-service-support": "Customer Service & Support",
		"data-science-analytics-ai": "Data Science, Analytics & AI",
		"education-training": "Education & Training",
		engineering: "Engineering",
		"energy-oil-gas": "Energy, Oil & Gas",
		"finance-accounting-audit": "Finance, Accounting & Audit",
		"healthcare-medical-services": "Healthcare & Medical Services",
		"hospitality-tourism-travel": "Hospitality, Tourism & Travel",
		"hr-recruitment": "Human Resources (HR) & Recruitment",
		"software-development": "Software Development",
		"it-support-administration": "IT Support & Administration",
		cybersecurity: "Cybersecurity",
		"network-infrastructure": "Network & Infrastructure",
		"insurance-actuarial": "Insurance & Actuarial Science",
		"legal-compliance": "Legal & Compliance",
		"logistics-supply-chain":
			"Logistics, Supply Chain & Procurement",
		"manufacturing-production": "Manufacturing & Production",
		"marketing-advertising-media": "Marketing, Advertising & Media",
		"non-profit-social-services":
			"Non-Profit, Social Services & NGOs",
		"product-project-management": "Product & Project Management",
		"real-estate-property": "Real Estate & Property Management",
		"retail-ecommerce": "Retail & E-commerce",
		"sales-business-development": "Sales & Business Development",
		"science-research-development":
			"Science, Research & Development",
		"security-law-enforcement":
			"Security, Law Enforcement & Intelligence",
		"skilled-trades-maintenance": "Skilled Trades & Maintenance",
		telecommunications: "Telecommunications",
		"transportation-driving": "Transportation & Driving",
	};

	return jobFieldMap[value] || value;
};

export const getDisplayNameForJobLevel = (value: string): string => {
	const jobLevelMap: Record<string, string> = {
		"entry-level": "Entry level",
		"mid-level": "Mid level",
		"senior-level": "Senior level",
		manager: "Manager",
		director: "Director",
		executive: "Executive",
	};

	return jobLevelMap[value] || value;
};
