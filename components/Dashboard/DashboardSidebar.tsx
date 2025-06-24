"use client";

import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboardNav } from "@/lib/dashboard-config";

export function DashboardSidebar({
	variant = "sidebar",
	collapsible = "none",
	sidebarCollapsed = false, // NEW PROP
}: {
	variant?: "inset" | "sidebar" | "floating";
	collapsible?: "offcanvas" | "icon" | "none";
	sidebarCollapsed?: boolean; // NEW PROP
}) {
	const pathname = usePathname();

	return (
		<Sidebar
			variant={variant}
			collapsible={collapsible}
			style={{
				width: sidebarCollapsed ? "48px" : "240px", // 48px for collapsed/mobile
				minWidth: sidebarCollapsed ? "48px" : "240px",
				transition: "width 0.2",
			}}>
			<SidebarContent
				className='bg-white font-poppins'
				style={{ paddingTop: "var(--header-height)" }}>
				<SidebarMenu className='flex flex-col gap-2'>
					{dashboardNav.map((item) => (
						<SidebarMenuItem
							key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={
									pathname ===
									item.url
								}
								className='flex items-center gap-2 hover:border hover:bg-white hover:text-black hover:border-pry2 md:px-4 '>
								<a
									href={
										item.url
									}
									className='flex items-center gap-3'>
									<item.icon className='w-5 h-5 mx-auto md:mx-0' />
									<span
										className={`${
											sidebarCollapsed
												? "hidden"
												: "inline"
										} md:inline`}>
										{
											item.title
										}
									</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
