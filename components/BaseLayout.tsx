"use client";

import Header from "./Header";
import Footer from "./Footer";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex flex-col min-h-screen bg-[#eeeef1]'>
			<Header />

			<main className='flex-1 mx-4 my-2 md:w-[84%] md:mx-auto'>
				{children}
			</main>

			<Footer />
		</div>
	);
};

export default BaseLayout;
