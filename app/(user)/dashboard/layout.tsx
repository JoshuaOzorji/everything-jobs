import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import Sidebar from "@/components/Dashboard/Sidebar";
import { DashboardLayoutProps } from "@/types/types";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className='flex min-h-screen bg-gray-100'>
			<Sidebar />
			<div className='flex-1'>
				<DashboardHeader />
				<main className='p-6'>{children}</main>
			</div>
		</div>
	);
}
