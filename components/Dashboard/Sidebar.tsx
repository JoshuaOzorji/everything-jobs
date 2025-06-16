import Image from "next/image";
import SidebarLink from "../Dashboard/SidebarLink";

const Sidebar = () => {
	return (
		<nav className='w-64 bg-gray-800 min-h-screen p-4 flex flex-col'>
			{/* Logo Section */}
			<div className='mb-8 px-4'>
				<h1 className='text-white text-xl font-semibold'>
					Everything Jobs
				</h1>
			</div>

			{/* Navigation Links */}
			<div className='space-y-2'>
				<SidebarLink
					href='/dashboard'
					label='Dashboard'
				/>
				<SidebarLink
					href='/dashboard/company'
					label='Company Profile'
				/>
				<SidebarLink
					href='/dashboard/view-jobs'
					label='Job Submissions'
				/>
				<SidebarLink
					href='/dashboard/post-job'
					label='Post New Job'
				/>
			</div>
		</nav>
	);
};

export default Sidebar;
