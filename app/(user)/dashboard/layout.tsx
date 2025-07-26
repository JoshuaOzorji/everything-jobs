"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

// Company data fetcher function (same as in the hook)
const fetchCompanyData = async () => {
	const response = await fetch("/api/company/check");
	if (!response.ok) {
		throw new Error("Failed to check company data");
	}
	return response.json();
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const isMobile = useIsMobile();
	const [hasMounted, setHasMounted] = useState(false);
	const queryClient = useQueryClient();

	useEffect(() => {
		setHasMounted(true);

		// Prefetch company data as soon as the dashboard loads
		// This ensures the data is ready before components request it
		queryClient.prefetchQuery({
			queryKey: ["company-data"],
			queryFn: fetchCompanyData,
			staleTime: 5 * 60 * 1000, // Same as the hook configuration
		});
	}, [queryClient]);

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
