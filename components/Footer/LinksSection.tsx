import Link from "next/link";

interface LinksSectionProps {
	title: string;
	links: { href: string; label: string }[];
	keyPrefix: string;
}

const LinksSection = ({ title, links, keyPrefix }: LinksSectionProps) => {
	return (
		<div>
			<h3 className='footer-h2'>{title}</h3>
			<ul className='space-y-2'>
				{links.map((link, index) => (
					<li key={`${keyPrefix}-${index}`}>
						<Link
							href={link.href}
							className='transition text-myBlack hover:text-pry'>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LinksSection;
