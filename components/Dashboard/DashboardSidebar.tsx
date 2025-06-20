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
	const { data: session } = useSession();

	// Get user initials for avatar fallback
	const getInitials = (name?: string | null) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Sidebar
			variant={variant}
			collapsible={collapsible}
			style={{ width: "260px", minWidth: "260px" }}>
			<SidebarHeader>
				<div className='px-4 py-6'>
					<h1 className='text-xl font-semibold text-white'>
						Everything Jobs
					</h1>
				</div>
			</SidebarHeader>

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

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size='lg'
							className='w-full'
							onClick={() =>
								signOut()
							}>
							<Avatar className='h-8 w-8'>
								<AvatarImage
									src={
										session
											?.user
											?.image ??
										""
									}
								/>
								<AvatarFallback>
									{getInitials(
										session
											?.user
											?.name,
									)}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left'>
								<span className='font-semibold'>
									{
										session
											?.user
											?.name
									}
								</span>
								<span className='text-xs text-gray-400'>
									{
										session
											?.user
											?.email
									}
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
