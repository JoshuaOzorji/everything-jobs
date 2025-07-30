// BaseLayout.tsx
"use client";

import Header from "./Header";
import FooterMain from "./Footer/FooterMain";

interface BaseLayoutProps {
	children: React.ReactNode;
	initialSession?: any; // Pass initial session from server
}

const BaseLayout = ({ children, initialSession }: BaseLayoutProps) => {
	return (
		<div className='flex flex-col min-h-screen bg-[#eeeef1]'>
			<Header initialSession={initialSession} />

			<main className='flex-1 mx-3 my-2 md:w-[84%] md:mx-auto'>
				{children}
			</main>

			<FooterMain />
		</div>
	);
};

export default BaseLayout;
