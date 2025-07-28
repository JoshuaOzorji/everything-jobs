import { Building2, ClipboardList, FilePlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	matchUrls?: string[];
	isActive?: boolean;
	isDynamic?: boolean; // Flag for dynamic links
};

export const dashboardNav: NavItem[] = [
	{
		title: "Post New Job",
		url: "/dashboard/post-job",
		icon: FilePlus,
	},
	{
		title: "Job Submissions",
		url: "/dashboard/view-jobs",
		icon: ClipboardList,
	},
	{
		title: "Company Profile",
		url: "/dashboard/company",
		matchUrls: ["/dashboard/company-profile", "/dashboard/company"],
		icon: Building2,
		isDynamic: true,
	},
];

// Function to get dynamic navigation based on company data
export const getDynamicNav = (hasCompanyData: boolean | null): NavItem[] => {
	return dashboardNav.map((item) => {
		if (item.isDynamic && item.title === "Company Profile") {
			if (hasCompanyData === null) {
				return item;
			}

			return {
				...item,
				title: "Company Profile",
				// Only change the URL based on company data
				url: hasCompanyData
					? "/dashboard/company-profile"
					: "/dashboard/company",
			};
		}
		return item;
	});
};
