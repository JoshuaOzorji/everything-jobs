export const findJobsDropdownItems = [
	{ label: "Jobs by Education", href: "/jobs/by-education" },
	{ label: "Jobs by Field", href: "/jobs/by-field" },
	{ label: "Jobs by Location", href: "/jobs/by-location" },
	{ label: "Jobs by Type", href: "/jobs/by-type" },
];

interface NavigationLink {
	href: string;
	label: string;
	isExternal?: boolean;
}

export const navigationLinks: NavigationLink[] = [
	{
		href: "/dashboard/post-job",
		label: "Post Job",
	},
	{
		href: "/dashboard/view-jobs",
		label: "Job Submissions",
	},
	{
		href: "/dashboard/company-profile",
		label: "Profile",
	},
];

export const quickLinks = [
	{ label: "Browse All Jobs", href: "/jobs" },
	{ label: "Recent Jobs", href: "/" },
	{ label: "Browse Companies", href: "/companies" },
	{ label: "Jobs by Education", href: "/jobs/by-education" },
	{ label: "Jobs by Field", href: "/jobs/by-field" },
	{ label: "Jobs by Location", href: "/jobs/by-location" },
	{ label: "Jobs by Type", href: "/jobs/by-type" },
];

export const jobSeekerLinks = [
	// { label: "Create Profile", href: "/create-profile" },
	{ label: "Resume Tips", href: "/resources/resume-tips" },
	{
		label: "Interview Preparation",
		href: "/resources/interview-preparation",
	},
	{ label: "Salary Guides", href: "/salary-guides" },
	{ label: "Career Advice", href: "/career-advice" },
	{ label: "Help Center", href: "/help-center" },
];

export const legalLinks = [
	{ label: "Privacy Policy", href: "/privacy-policy" },
	{ label: "Terms of Service", href: "/terms-of-service" },
	{ label: "Contact Us", href: "/contact" },
];
