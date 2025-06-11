import CompanyInfo from "./CompanyInfo";
import LinksSection from "./LinksSection";
import Newsletter from "./Newsletter";
import FooterBottom from "./FooterBottom";
import { quickLinks, jobSeekerLinks } from "@/lib/data";

const FooterMain = () => {
	return (
		<footer className='mt-12 text-black border-t bg-gray-300/70 font-openSans'>
			<div className='w-[96%] mx-auto py-12 px-2 md:px-4 text-sm'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
					<CompanyInfo />

					{/* Small Screen Layout */}
					<div className='flex flex-row justify-between md:hidden'>
						<div className='w-1/2'>
							<LinksSection
								title='Find Jobs'
								links={
									quickLinks
								}
								keyPrefix='quick'
							/>
						</div>
						<div className='w-1/2'>
							<LinksSection
								title='For Job Seekers'
								links={
									jobSeekerLinks
								}
								keyPrefix='seeker'
							/>
						</div>
					</div>

					{/* Medium and Large Screen Layout */}
					<div className='hidden md:block'>
						<LinksSection
							title='Find Jobs'
							links={quickLinks}
							keyPrefix='quick'
						/>
					</div>
					<div className='hidden md:block'>
						<LinksSection
							title='For Job Seekers'
							links={jobSeekerLinks}
							keyPrefix='seeker'
						/>
					</div>

					<Newsletter />
				</div>
			</div>
			<FooterBottom />
		</footer>
	);
};

export default FooterMain;
