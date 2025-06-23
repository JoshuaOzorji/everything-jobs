"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayoutProps } from "@/types/types";

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return isMobile;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const isMobile = useIsMobile();
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<div className='[--header-height:calc(theme(spacing.14))]'>
			<div className='relative flex flex-col md:flex-row gap-8 my-4 md:w-[84%] md:mx-auto overflow-visible'>
				<SidebarProvider>
					<div className='relative flex flex-1 bg-gray-100'>
						{/* Only render sidebar after mount to avoid hydration mismatch */}
						{sidebarOpen && hasMounted && (
							<div
								className={`transition-all duration-200 ${
									isMobile
										? "w-12 min-w-12"
										: "w-[240px] min-w-[240px]"
								}`}>
								<DashboardSidebar
									variant='sidebar'
									collapsible='none'
									sidebarCollapsed={
										isMobile
									}
								/>
							</div>
						)}
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
