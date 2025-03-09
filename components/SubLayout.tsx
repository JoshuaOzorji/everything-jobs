import React from "react";

interface SubLayoutProps {
	children: React.ReactNode;
	aside: React.ReactNode;
}
const SubLayout = ({ children, aside }: SubLayoutProps) => {
	return (
		<div>
			<div className='flex flex-col md:flex-row gap-4 my-6'>
				<div className='md:w-[65%]'>{children}</div>
				<aside className='md:w-[35%]'>{aside}</aside>
			</div>
		</div>
	);
};

export default SubLayout;
