"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function SidebarWrapper() {
	const { open, isMobile } = useSidebar();

	// Only render the sidebar when open
	if (!open && !isMobile) return null;

	return (
		<div className='absolute left-0 top-0 h-full z-30'>
			<DashboardSidebar
				variant='floating'
				collapsible='offcanvas'
			/>
		</div>
	);
}
