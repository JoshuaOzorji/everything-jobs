import React from "react";

interface SubLayoutProps {
	children: React.ReactNode;
	aside: React.ReactNode;
}
const SubLayout = ({ children, aside }: SubLayoutProps) => {
	return (
		<div className='flex flex-col gap-8 my-0.5 md:flex-row '>
			<div className='md:w-[66%]'>{children}</div>
			<aside className='md:w-[34%]'>{aside}</aside>
		</div>
	);
};

export default SubLayout;
