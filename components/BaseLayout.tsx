"use client";

import Header from "./Header";
import Footer from "./Footer";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='flex flex-col min-h-screen bg-acc2'>
			<Header />

			<div className='flex-1 mx-4 my-2 md:my-4 md:mx-8'>
				{children}
			</div>
			<Footer />
		</main>
	);
};

export default BaseLayout;
