"use client";

import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardNav } from "@/lib/dashboard-config";
import { useSession, signOut } from "next-auth/react";

export function DashboardSidebar({
	variant = "sidebar",
	collapsible = "none",
}: {
	variant?: "inset" | "sidebar" | "floating";
	collapsible?: "offcanvas" | "icon" | "none";
}) {
	const pathname = usePathname();

	return (
		<Sidebar
			variant={variant}
			collapsible={collapsible}
			style={{ width: "260px", minWidth: "260px" }}>
			<SidebarContent>
				<SidebarMenu>
					{dashboardNav.map((item) => (
						<SidebarMenuItem
							key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={
									pathname ===
									item.url
								}
								className='hover:bg-blue-600 hover:text-white'>
								<a
									href={
										item.url
									}>
									<item.icon className='h-4 w-4' />
									<span>
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
