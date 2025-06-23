import {
	LayoutDashboard,
	Building2,
	ClipboardList,
	FilePlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	isActive?: boolean;
};

export const dashboardNav: NavItem[] = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
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
		icon: Building2,
	},
];
