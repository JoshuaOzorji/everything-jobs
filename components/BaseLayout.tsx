"use client";

import Header from "./Header";
import Footer from "./Footer";
import Hero from "./Hero";
import { usePathname } from "next/navigation";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	return (
		<main className='flex flex-col min-h-screen bg-acc2'>
			<Header />
			{/* Only show Hero on the Homepage */}
			{pathname === "/" && <Hero />}
			<div className='flex-1 mx-4 my-2 md:my-4 md:mx-8'>
				{children}
			</div>
			<Footer />
		</main>
	);
};

export default BaseLayout;
