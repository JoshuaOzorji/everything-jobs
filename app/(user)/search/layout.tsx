import { Metadata } from "next";

type Props = {
	params: { id: string };
	searchParams?: { [key: string]: string | string[] | undefined }; // ✅ Make searchParams optional
};

export function generateMetadata({ searchParams = {} }: Props): Metadata {
	// ✅ Default to empty object
	const query = searchParams.query?.toString() || "";
	const location = searchParams.location?.toString() || "";

	let title = "Job Search";
	if (query) title = `Jobs matching "${query}"`;
	if (location) title += ` in ${location}`;

	return {
		title,
		description: `Browse job listings ${query ? `matching "${query}"` : ""} ${location ? `in ${location}` : ""}. Find your next career opportunity.`,
	};
}

export default function SearchLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
