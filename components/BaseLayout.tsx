import Header from "./Header";
import Footer from "./Footer";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex flex-col min-h-screen bg-'>
			<Header />
			<div className='flex-1 mx-4 my-2 md:my-6 md:mx-10'>
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default BaseLayout;
