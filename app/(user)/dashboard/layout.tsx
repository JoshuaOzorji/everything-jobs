"use client";
import { useState } from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayoutProps } from "@/types/types";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className='[--header-height:calc(theme(spacing.14))]'>
			<div className='relative flex flex-col md:flex-row gap-8 my-6 md:w-[84%] mx-4 md:mx-auto overflow-visible'>
				{/* Wrap with SidebarProvider */}
				<SidebarProvider>
					<div className='relative flex flex-1 bg-gray-100'>
						{/* Sidebar: only render when open */}
						{sidebarOpen && (
							<div className='transition-all duration-300 w-[260px] min-w-[260px]'>
								<DashboardSidebar
									variant='sidebar'
									collapsible='none'
								/>
							</div>
						)}
						{/* Main content */}
						<div
							className={`flex-1 min-w-0 transition-all duration-300 ${
								sidebarOpen
									? "ml-0"
									: ""
							}`}>
							<SiteHeader
								onSidebarToggle={() =>
									setSidebarOpen(
										(
											v,
										) =>
											!v,
									)
								}
								sidebarOpen={
									sidebarOpen
								}
							/>
							<main className='p-6'>
								{children}
							</main>
						</div>
					</div>
				</SidebarProvider>
			</div>
		</div>
	);
}
