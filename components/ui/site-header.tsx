"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dashboardNav } from "@/lib/dashboard-config";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function SiteHeader({
	onSidebarToggle,
	sidebarOpen,
}: {
	onSidebarToggle?: () => void;
	sidebarOpen?: boolean;
}) {
	const pathname = usePathname();
	const currentNav = dashboardNav.find((item) => item.url === pathname);
	const title = currentNav?.title || "Dashboard";

	return (
		<header className='sticky top-0 z-20 w-full border-b bg-white'>
			<div className='flex h-[--header-height] w-full items-center gap-2 px-4'>
				<Button
					className='h-8 w-8'
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
					className='mr-2 h-4'
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
