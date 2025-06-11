"use client";

import Header from "./Header";
import FooterMain from "./Footer/FooterMain";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex flex-col min-h-screen bg-[#eeeef1]'>
			<Header />

			<main className='flex-1 mx-4 my-2 md:w-[84%] md:mx-auto'>
				{children}
			</main>

			<FooterMain />
		</div>
	);
};

export default BaseLayout;
