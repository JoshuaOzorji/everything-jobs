"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useCompanyData } from "@/hooks/useCompanyStatus";
import { getDynamicNav } from "@/lib/dashboard-config";

export function SiteHeader({
	onSidebarToggle,
	sidebarOpen,
}: {
	onSidebarToggle?: () => void;
	sidebarOpen?: boolean;
}) {
	const pathname = usePathname();
	const { hasCompanyData } = useCompanyData();
	const navItems = getDynamicNav(hasCompanyData);

	// Match using full url or matchUrls fallback
	const currentNav = navItems.find(
		(item) =>
			item.url === pathname ||
			item.matchUrls?.some((url) => url === pathname),
	);

	const title = currentNav?.title || "Dashboard";

	return (
		<header className='sticky top-0 z-20 w-full bg-white border-b'>
			<div className='flex h-[--header-height] w-full items-center gap-2 px-4 border-l font-poppins'>
				<Button
					className='w-8 h-8'
					variant='ghost'
					size='icon'
					onClick={onSidebarToggle}
					aria-label={
						sidebarOpen
							? "Close sidebar"
							: "Open sidebar"
					}>
					<SidebarIcon />
				</Button>
				<Separator
					orientation='vertical'
					className='h-4 mr-2'
				/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>
								<p className='font-bold'>
									{title}
								</p>
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
