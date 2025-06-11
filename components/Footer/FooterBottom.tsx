import Link from "next/link";
import { legalLinks } from "@/lib/data";

const FooterBottom = () => {
	const currentYear = new Date().getFullYear();

	return (
		<div className='py-3 text-xs border-t border-[#adadad] md:px-2 text-myBlack'>
			<div className='w-[96%] mx-auto'>
				<div className='flex flex-col items-center justify-between md:flex-row'>
					<p className=''>
						© {currentYear} Your Job Search
						Company. All rights reserved.
					</p>
					<div className='flex mt-2 space-x-6 md:mt-0'>
						{legalLinks.map(
							(link, index) => (
								<Link
									key={`legal-${index}`}
									href={
										link.href
									}
									className='transition hover:text-pry2'>
									{
										link.label
									}
								</Link>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FooterBottom;
